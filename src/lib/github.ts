/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_DATA } from "@/data/apiData";
import { profile } from "@/data/profile";


async function getCommitMessagesGraphQL(eventsToFetch: any[], headers: Record<string, string>) {
  if (eventsToFetch.length === 0) return {};

  let query = "query {\n";
  eventsToFetch.forEach((e, i) => {
    const [owner, name] = e.repo.name.split("/");
    query += `  repo${i}: repository(owner: "${owner}", name: "${name}") {
    object(oid: "${e.payload.head}") {
      ... on Commit { message }
    }
  }\n`;
  });
  query += "}";

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const { data } = await res.json();
    const results: Record<string, string> = {};
    if (data) {
      eventsToFetch.forEach((e, i) => {
        const msg = data[`repo${i}`]?.object?.message;
        if (msg) results[e.payload.head] = msg;
      });
    }
    return results;
  } catch {
    return {};
  }
}

async function getCommitMessage(repoName: string, sha: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoName}/commits/${sha}`, {
      headers,
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.commit?.message || null;
  } catch {
    return null;
  }
}

export async function getLiveGithubData() {
  try {
    const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || profile.github || "mbayue";

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "mbayue-portfolio",
    };

    if (token) {
      headers.Authorization = token.startsWith("github_pat_")
        ? `Bearer ${token.trim()}`
        : `token ${token.trim()}`;
    }

    const [userRes, eventsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 300 },
      }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=15`, {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    if (userRes.status !== "fulfilled" || !userRes.value.ok) {
      return {
        ...API_DATA["/github"],
        _meta: { source: "snapshot_fallback", status: "cached" },
      };
    }

    const userData = await userRes.value.json();
    let recentActivity = API_DATA["/github"].recent_activity;

    if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
      const events = await eventsRes.value.json();
      if (Array.isArray(events) && events.length > 0) {
        const slicedEvents = events.slice(0, 6);
        let commitMessageMap: Record<string, string> = {};

        const eventsToFetch = slicedEvents.filter((e: any) => {
          if (e.type === "PushEvent") {
            const commits = Array.isArray(e.payload?.commits) ? e.payload.commits : [];
            const commitMsg = commits.find((c: any) => c?.message && c.message.trim().length > 0)?.message;
            return !commitMsg && e.payload?.head && e.repo?.name;
          }
          return false;
        });

        if (eventsToFetch.length > 0) {
          if (token) {
            const graphQLMessages = await getCommitMessagesGraphQL(eventsToFetch, headers);
            commitMessageMap = graphQLMessages;
            const missingEvents = eventsToFetch.filter((e: any) => !commitMessageMap[e.payload.head]);
            if (missingEvents.length > 0) {
              const msgs = await Promise.all(
                missingEvents.map((e: any) => getCommitMessage(e.repo.name, e.payload.head, headers))
              );
              missingEvents.forEach((e: any, i: number) => {
                if (msgs[i]) commitMessageMap[e.payload.head] = msgs[i] as string;
              });
            }
          } else {
            const msgs = await Promise.all(
              eventsToFetch.map((e: any) => getCommitMessage(e.repo.name, e.payload.head, headers))
            );
            eventsToFetch.forEach((e: any, i: number) => {
              if (msgs[i]) commitMessageMap[e.payload.head] = msgs[i] as string;
            });
          }
        }

        recentActivity = slicedEvents.map((e: any) => {
          let message = "Repository activity";

          if (e.type === "PushEvent") {
            const commits = Array.isArray(e.payload?.commits) ? e.payload.commits : [];
            let commitMsg = commits.find((c: any) => c?.message && c.message.trim().length > 0)?.message;

            // If event payload has no commit messages (standard GitHub behavior for pushes), fetch from commits API by head sha
            if (!commitMsg && e.payload?.head && e.repo?.name) {
              commitMsg = commitMessageMap[e.payload.head];
            }

            if (commitMsg) {
              message = commitMsg.split("\n")[0];
            } else if (e.payload?.ref) {
              const branch = e.payload.ref.replace("refs/heads/", "");
              const count = e.payload.size || e.payload.distinct_size || commits.length;
              message = count > 1 ? `Pushed ${count} commits to ${branch}` : `Pushed to ${branch}`;
            } else {
              message = "Pushed code changes";
            }
          } else if (e.type === "WatchEvent") {
            message = "Starred repository";
          } else if (e.type === "CreateEvent") {
            const refType = e.payload?.ref_type || "repository";
            const ref = e.payload?.ref ? ` ${e.payload.ref}` : "";
            message = `Created ${refType}${ref}`;
          } else if (e.type === "PullRequestEvent") {
            const action = e.payload?.action || "opened";
            const title = e.payload?.pull_request?.title;
            message = title ? `${action} PR: ${title}` : `${action} pull request`;
          } else if (e.type === "IssuesEvent") {
            const action = e.payload?.action || "opened";
            const title = e.payload?.issue?.title;
            message = title ? `${action} issue: ${title}` : `${action} issue`;
          } else if (e.type === "ForkEvent") {
            message = `Forked repository`;
          }

          const dateStr = new Date(e.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          });

          return {
            repo: e.repo?.name || "mbayue",
            date: dateStr,
            message,
          };
        });
      }
    }



    return {
      public_repositories: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      public_gists: userData.public_gists,
      profile_url: userData.html_url,
      account_created: new Date(userData.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      }),
      recent_activity: recentActivity,
      _meta: {
        source: "api.github.com",
        status: "live",
        synced_at: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ...API_DATA["/github"],
      _meta: { source: "snapshot_fallback", status: "cached" },
    };
  }
}
