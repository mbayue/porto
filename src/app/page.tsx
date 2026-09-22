"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  ExternalLink,
  Mail,
  ArrowUp,
  Terminal,
  FileText,
  Layers,
  Code2
} from "lucide-react";
import { API_DATA, ROUTES, ApiRoute } from "@/data/apiData";

interface JsonNodeProps {
  k: string | null;
  val: any;
  depth?: number;
}

function JsonTree({ k, val, depth = 0 }: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isArr = Array.isArray(val);
  const isObj = val && typeof val === "object" && !isArr;

  if (!isArr && !isObj) {
    let valClass = "text-[#ededed]";
    let renderedVal = `"${val}"`;

    if (val === null) {
      valClass = "text-[#8a8a8a]";
      renderedVal = "null";
    } else if (typeof val === "number") {
      valClass = "text-white font-medium";
      renderedVal = String(val);
    } else if (typeof val === "boolean") {
      valClass = "text-white font-medium";
      renderedVal = String(val);
    }

    return (
      <div className="font-mono text-[13px] leading-relaxed flex flex-wrap items-baseline break-all [overflow-wrap:anywhere]">
        {k !== null && (
          <>
            <span className="text-[#c8c8c8]">"{k}"</span>
            <span className="text-[#8a8a8a] mr-2">:</span>
          </>
        )}
        <span className={`${valClass} break-all [overflow-wrap:anywhere]`}>{renderedVal}</span>
      </div>
    );
  }

  const keys = isArr ? null : Object.keys(val);
  const count = isArr ? val.length : keys!.length;
  const openBracket = isArr ? "[" : "{";
  const closeBracket = isArr ? "]" : "}";

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="cursor-pointer hover:bg-[#161616] -mx-2 px-2 py-0.5 rounded-[2px] transition-colors flex items-baseline gap-2 group select-none w-full text-left"
      >
        {k !== null && (
          <>
            <span className="text-[#c8c8c8]">"{k}"</span>
            <span className="text-[#8a8a8a]">:</span>
          </>
        )}
        <span className="text-[#999999] font-semibold">{openBracket}</span>
        <span className="text-[#8a8a8a] text-[11.5px] group-hover:text-white transition-colors">
          {count} {isArr ? (count === 1 ? "item" : "items") : (count === 1 ? "key" : "keys")}
        </span>
        {collapsed && <span className="text-[#8a8a8a]">... {closeBracket}</span>}
      </button>

      {!collapsed && (
        <div className="pl-4 ml-1.5 border-l border-[#222222] my-0.5 space-y-0.5">
          {isArr
            ? val.map((item: any, idx: number) => (
                <JsonTree key={idx} k={String(idx)} val={item} depth={depth + 1} />
              ))
            : keys!.map((keyName) => (
                <JsonTree
                  key={keyName}
                  k={keyName}
                  val={val[keyName]}
                  depth={depth + 1}
                />
              ))}
        </div>
      )}

      {!collapsed && (
        <div className="text-[#999999] font-semibold">{closeBracket}</div>
      )}
    </div>
  );
}

export default function ApiConsolePage() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [viewMode, setViewMode] = useState<"json" | "rendered">("json");
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [msgEmail, setMsgEmail] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgResponse, setMsgResponse] = useState<any>(null);
  const [liveGithub, setLiveGithub] = useState<any>(null);

  // Fetch live GitHub data on mount
  useEffect(() => {
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setLiveGithub(data);
      })
      .catch(() => {});
  }, []);

  // Sync with window.location.hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && API_DATA[hash]) {
        setCurrentPath(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Deep-link viewMode via ?view=cards (default json omits param)
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    if (v === "cards" || v === "rendered") {
      setViewMode("rendered");
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (viewMode === "rendered") {
      url.searchParams.set("view", "cards");
    } else {
      url.searchParams.delete("view");
    }
    window.history.replaceState(null, "", url.toString());
  }, [viewMode]);

  const selectRoute = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
  };

  const currentRouteData = ROUTES.find((r) => r.path === currentPath) || {
    path: currentPath,
    method: "GET" as const,
    desc: "endpoint",
  };

  // Canonical API URL: /api has no trailing slash (Next 308s /api/ -> /api)
  const apiUrl =
    `https://bayue.my.id/api${currentPath === "/" ? "" : currentPath}`;

  const responseData =
    currentPath === "/github" && liveGithub
      ? liveGithub
      : API_DATA[currentPath] || {
          error: "not_found",
          message: `No endpoint at ${currentPath}.`,
          hint: "GET / lists every route.",
        };

  const copyToClipboard = async (text: string, isCurl: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isCurl) {
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 1500);
      } else {
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 1500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed] font-mono antialiased selection:bg-white selection:text-black">
      {/* Site Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[62px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5 py-2">
              <span translate="no">bayue.my.id</span>
            </Link>
            <span className="text-[11px] text-[#999999] border border-[#222222] px-2 py-0.5">
              v2.1.0
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#03b000] border border-[#03b000]/40 px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#03b000] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span>200 OK</span>
            </span>

            <Link
              href="/cv"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-black bg-white hover:bg-[#e0e0e0] border border-white px-3 py-1.5 min-h-[36px] transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Get my CV</span>
              <span className="sm:hidden">CV</span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Masthead */}
        <section className="py-12 sm:py-16 border-b border-[#181818]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#888888] mb-5">
            <span className="text-white border border-[#333333] px-1.5 py-0.5">GET</span>
            <span>/</span>
            <span>service: bayu-erich</span>
            <span className="text-[#444444]">•</span>
            <span>application/json</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.15] max-w-3xl">
            Building reliable APIs and <span className="text-white underline underline-offset-4">backend systems.</span>
          </h1>

          <p className="mt-5 text-[#888888] text-sm sm:text-base max-w-2xl leading-relaxed">
            I'm <b className="text-white font-medium">Bayu Erich</b>, a backend engineer based in Tuban, Indonesia. I build APIs, optimize database queries, and deploy production services on Linux. This portfolio runs as a queryable API console.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("console");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="px-4 py-2 bg-white text-black font-medium text-xs hover:bg-[#e0e0e0] transition-colors inline-flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Explore endpoints</span>
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(`curl ${apiUrl}`, true)}
              className="px-4 py-2 border border-[#222222] text-[#ededed] font-medium text-xs hover:border-white transition-colors inline-flex items-center gap-2"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-[#03b000]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              <span aria-live="polite">{copiedCurl ? "Copied curl" : "Copy curl"}</span>
            </button>

            <a
              href="mailto:bayu.erich@gmail.com"
              className="px-4 py-2 border border-[#222222] text-[#888888] hover:text-white hover:border-white transition-colors text-xs inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Let's talk</span>
            </a>
          </div>

          <div className="mt-6 text-xs text-[#8a8a8a] border-l-2 border-[#222222] pl-3 max-w-xl">
            Select an endpoint on the left to inspect raw payloads and schema structures.
          </div>
        </section>

        {/* API Console */}
        <section id="console" className="pt-6 pb-10 sm:pt-8 sm:pb-14 scroll-mt-20">
          <div className="border border-[#222222] bg-[#0a0a0a] grid grid-cols-1 md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar Routes */}
            <div className="border-b md:border-b-0 md:border-r border-[#222222] bg-[#080808] flex flex-col">
              <div className="p-3 border-b border-[#222222] text-[11px] tracking-wider uppercase text-[#8a8a8a] flex justify-between items-center">
                <span>Endpoints</span>
                <span>{ROUTES.length} routes</span>
              </div>

              <ul className="divide-y divide-[#161616] flex flex-col overflow-y-auto max-h-[260px] md:max-h-none flex-1">
                {ROUTES.map((route) => {
                  const isActive = currentPath === route.path;
                  return (
                    <li key={route.path} className="w-full">
                      <button
                        type="button"
                        onClick={() => selectRoute(route.path)}
                        className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors ${
                          isActive
                            ? "bg-[#141414] border-l-2 border-white"
                            : "hover:bg-[#0e0e0e]"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 border shrink-0 ${
                            route.method === "POST"
                              ? "border-white text-white"
                              : "border-[#333333] text-[#888888]"
                          }`}
                        >
                          {route.method}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-white truncate">
                            {route.path}
                          </div>
                          <div className="text-[11px] text-[#8a8a8a] truncate mt-0.5">
                            {route.desc}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Main Console View */}
            <div className="flex flex-col min-w-0 bg-[#0a0a0a]">
              {/* Request Bar */}
              <div className="p-3 bg-[#101010] border-b border-[#222222] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 border shrink-0 ${
                      currentRouteData.method === "POST"
                        ? "border-white text-white"
                        : "border-[#333333] text-white"
                    }`}
                  >
                    {currentRouteData.method}
                  </span>
                  <span className="text-xs text-white truncate" translate="no">
                    {apiUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#222222] p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode("json")}
                      className={`px-3 py-1.5 min-h-[32px] sm:min-h-[30px] transition-colors flex items-center justify-center ${
                        viewMode === "json" ? "bg-white text-black font-semibold" : "text-[#8a8a8a] hover:text-white"
                      }`}
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("rendered")}
                      className={`px-3 py-1.5 min-h-[32px] sm:min-h-[30px] transition-colors flex items-center justify-center ${
                        viewMode === "rendered" ? "bg-white text-black font-semibold" : "text-[#8a8a8a] hover:text-white"
                      }`}
                    >
                      Cards
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(`curl -s ${apiUrl}`, true)}
                    className="border border-[#222222] px-3 py-1.5 min-h-[32px] sm:min-h-[30px] text-xs text-[#8a8a8a] hover:text-white hover:border-white transition-colors inline-flex items-center gap-1.5"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-[#03b000]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                    <span aria-live="polite">{copiedCurl ? "Copied" : "curl"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(responseData, null, 2), false)}
                    className="border border-[#222222] px-3 py-1.5 min-h-[32px] sm:min-h-[30px] text-xs text-[#8a8a8a] hover:text-white hover:border-white transition-colors inline-flex items-center gap-1.5"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-[#03b000]" aria-hidden="true" /> : <Code2 className="w-3.5 h-3.5" aria-hidden="true" />}
                    <span aria-live="polite">{copiedJson ? "Copied" : "JSON"}</span>
                  </button>
                </div>
              </div>

              {/* Status Line */}
              <div className="px-4 py-2 border-b border-[#181818] bg-[#0c0c0c] text-xs text-[#8a8a8a] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#03b000] font-semibold">200 OK</span>
                  <span className="text-[#333333]">/</span>
                  <span>application/json</span>
                  {currentPath === "/github" && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#03b000] border border-[#03b000]/40 px-1.5 py-0.5 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#03b000] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                      <span>{liveGithub?._meta?.status === "live" ? "LIVE SYNC" : "GITHUB"}</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8a8a8a]">
                  route: {currentPath}
                </div>
              </div>

              {/* Response Body */}
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain h-[500px] bg-[#080808]">
                {currentPath === "/messages" ? (
                  <div className="space-y-4">
                    <div className="p-4 border border-[#222222] bg-[#0c0c0c]">
                      <div className="text-xs text-[#888888] mb-1 font-semibold uppercase tracking-wider">
                        Interactive POST Payload Dispatcher
                      </div>
                      <p className="text-xs text-[#555555] mb-4">
                        Send a message payload directly to Bayu Erich. Submitting opens your client with prefilled headers.
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const payload = {
                            status: "201 Created",
                            timestamp: new Date().toISOString(),
                            sender: msgEmail || "anonymous_developer",
                            body: msgBody || "(empty message)",
                            delivery: "direct line to bayu.erich@gmail.com",
                            action: "Dispatched to mail client"
                          };
                          setMsgResponse(payload);
                          const mailto = `mailto:bayu.erich@gmail.com?subject=${encodeURIComponent(
                            "Inquiry from " + (msgEmail || "Portfolio Visitor")
                          )}&body=${encodeURIComponent(msgBody)}`;
                          window.location.href = mailto;
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label htmlFor="msg-email" className="block text-[11px] text-[#888888] mb-1 font-mono">
                            {`"sender_email"`}: string
                          </label>
                          <input
                            id="msg-email"
                            name="sender_email"
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
                            value={msgEmail}
                            onChange={(e) => setMsgEmail(e.target.value)}
                            placeholder="your.email@company.com…"
                            required
                            aria-required="true"
                            className="w-full bg-black border border-[#222222] px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="msg-body" className="block text-[11px] text-[#888888] mb-1 font-mono">
                            {`"body"`}: string
                          </label>
                          <textarea
                            id="msg-body"
                            name="body"
                            value={msgBody}
                            onChange={(e) => setMsgBody(e.target.value)}
                            placeholder="Type your message, opportunity, or question…"
                            required
                            aria-required="true"
                            rows={3}
                            className="w-full bg-black border border-[#222222] px-3 py-1.5 text-xs text-white font-mono focus:border-white focus:outline-none resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white text-black text-xs font-semibold hover:bg-[#e0e0e0] transition-colors inline-flex items-center gap-2"
                        >
                          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Dispatch POST /messages</span>
                        </button>
                      </form>
                    </div>

                    {msgResponse && (
                      <div role="status" aria-live="polite" className="p-3 border border-[#03b000]/40 bg-[#061405]">
                        <div className="text-[11px] text-[#03b000] font-semibold mb-1">
                          HTTP 201 Created • Payload Dispatched
                        </div>
                        <pre className="text-xs text-[#b8f5b4] whitespace-pre-wrap break-words">
                          {JSON.stringify(msgResponse, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : viewMode === "json" ? (
                  <div className="space-y-1">
                    <JsonTree k={null} val={responseData} />
                  </div>
                ) : (
                  /* Rendered View */
                  <div className="space-y-4">
                    {currentPath === "/projects" ? (
                      <div className="space-y-3">
                        <div className="text-xs text-[#888888] pb-2 border-b border-[#222222]">
                          Seven shipped engineering projects
                        </div>
                        {responseData.data?.map((p: any) => (
                          <div key={p.name} className="p-3 border border-[#222222] bg-[#0f0f0f]">
                            <div className="flex justify-between items-baseline gap-2 min-w-0">
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-white hover:underline inline-flex items-center gap-1"
                              >
                                <span>{p.name}</span>
                                <ExternalLink className="w-3 h-3 text-[#666666]" aria-hidden="true" />
                              </a>
                              <span className="text-[10px] uppercase text-[#666666] border border-[#222222] px-1.5 py-0.5">
                                {p.category}
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs text-[#aaaaaa] leading-relaxed">
                              {p.description}
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {p.tags?.map((t: string) => (
                                <span key={t} className="text-[10px] text-[#888888] bg-[#141414] border border-[#222222] px-1.5 py-0.5">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : currentPath === "/experience" ? (
                      <div className="space-y-4">
                        {responseData.data?.map((exp: any) => (
                          <div key={exp.company} className="p-4 border border-[#222222] bg-[#0f0f0f]">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-sm font-semibold text-white">{exp.company}</h3>
                              <span className="text-xs text-[#888888]">{exp.period}</span>
                            </div>
                            <div className="text-xs text-[#aaaaaa] mt-0.5">{exp.role} • {exp.location}</div>
                            <ul className="mt-3 space-y-1.5 text-xs text-[#888888]">
                              {exp.highlights?.map((h: string, idx: number) => (
                                <li key={idx} className="relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-white">
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : currentPath === "/github" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="p-3 border border-[#222222] bg-[#0f0f0f]">
                            <div className="text-[10px] uppercase text-[#666666]">Public Repos</div>
                            <div className="text-xl font-semibold text-white mt-0.5 tabular-nums">
                              {responseData.public_repositories ?? "—"}
                            </div>
                          </div>
                          <div className="p-3 border border-[#222222] bg-[#0f0f0f]">
                            <div className="text-[10px] uppercase text-[#666666]">Followers</div>
                            <div className="text-xl font-semibold text-white mt-0.5 tabular-nums">
                              {responseData.followers ?? "—"}
                            </div>
                          </div>
                          <div className="p-3 border border-[#222222] bg-[#0f0f0f]">
                            <div className="text-[10px] uppercase text-[#666666]">Following</div>
                            <div className="text-xl font-semibold text-white mt-0.5 tabular-nums">
                              {responseData.following ?? "—"}
                            </div>
                          </div>
                          <div className="p-3 border border-[#222222] bg-[#0f0f0f]">
                            <div className="text-[10px] uppercase text-[#666666]">Public Gists</div>
                            <div className="text-xl font-semibold text-white mt-0.5 tabular-nums">
                              {responseData.public_gists ?? "—"}
                            </div>
                          </div>
                        </div>

                        {responseData.recent_activity?.length > 0 && (
                          <div className="p-4 border border-[#222222] bg-[#0f0f0f] space-y-3">
                            <div className="text-xs text-[#888888] font-semibold uppercase tracking-wider">
                              Recent Commit & Activity Stream
                            </div>
                            <div className="divide-y divide-[#1b1b1b]">
                              {responseData.recent_activity.map((act: any, idx: number) => (
                                <div key={idx} className="py-2 flex justify-between items-baseline gap-2">
                                  <div className="min-w-0">
                                    <span className="text-xs text-white font-mono">{act.repo}</span>
                                    <p className="text-xs text-[#888888] truncate">{act.message}</p>
                                  </div>
                                  <span className="text-[11px] text-[#555555] flex-shrink-0">{act.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 border border-[#222222] bg-[#0f0f0f] space-y-3">
                        <pre className="text-xs text-[#ededed] whitespace-pre-wrap break-words leading-relaxed">
                          {JSON.stringify(responseData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Action helpers inside Console */}
                <div className="mt-6 pt-4 border-t border-[#181818] flex flex-wrap gap-2">
                  {currentPath === "/projects" && (
                    <a
                      href="https://github.com/mbayue?tab=repositories"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-[#333333] text-white hover:border-white text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      <span>All GitHub repositories</span>
                    </a>
                  )}

                  {currentPath === "/experience" && (
                    <Link
                      href="/cv"
                      className="px-3 py-1.5 bg-white text-black text-xs font-medium hover:bg-[#e0e0e0] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3 h-3" aria-hidden="true" />
                      <span>View complete CV sheet</span>
                    </Link>
                  )}

                  {currentPath === "/github" && (
                    <a
                      href="https://github.com/mbayue"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-[#333333] text-white hover:border-white text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      <span>Open github.com/mbayue</span>
                    </a>
                  )}

                  {currentPath === "/contact" && (
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="mailto:bayu.erich@gmail.com"
                        className="px-3 py-1.5 bg-white text-black text-xs font-medium hover:bg-[#e0e0e0] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        <span>Email directly</span>
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText("bayu.erich@gmail.com");
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 1500);
                        }}
                        className="px-3 py-1.5 border border-[#333333] text-white hover:border-white text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-[#03b000]" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
                        <span aria-live="polite">{copiedEmail ? "Copied" : "Copy email address"}</span>
                      </button>
                      <a
                        href="https://github.com/mbayue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-[#333333] text-white hover:border-white text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/bayuerich/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-[#333333] text-white hover:border-white text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Console Foot Note */}
              <div className="p-3 border-t border-[#222222] bg-[#0c0c0c] text-[11px] text-[#8a8a8a] flex flex-wrap items-center justify-between gap-2">
                <span>Tip: Click any brace or key to collapse a node</span>
                <span className="text-[#888888]" translate="no">curl {apiUrl}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Below Console: Architecture & Terminal Cards */}
        <section className="py-10 border-t border-[#181818] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="#/architecture"
              onClick={() => selectRoute("/architecture")}
              className="block p-5 border border-[#1c1c1c] bg-[#080808] hover:border-[#444444] transition-colors group"
            >
              <div className="text-xs text-white font-semibold flex items-center gap-1.5 group-hover:underline">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GET /architecture</span>
              </div>
              <p className="mt-2 text-xs text-[#888888] leading-relaxed">
                Layered request lifecycle: reverse proxy, application runtime, databases, and background queue workers.
              </p>
            </a>

            <a
              href="#/projects"
              onClick={() => selectRoute("/projects")}
              className="block p-5 border border-[#1c1c1c] bg-[#080808] hover:border-[#444444] transition-colors group"
            >
              <div className="text-xs text-white font-semibold flex items-center gap-1.5 group-hover:underline">
                <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GET /projects</span>
              </div>
              <p className="mt-2 text-xs text-[#888888] leading-relaxed">
                Seven shipped tools and web applications with source repositories, stars, and technology stacks.
              </p>
            </a>

            <a
              href="#/messages"
              onClick={() => selectRoute("/messages")}
              className="block p-5 border border-[#1c1c1c] bg-[#080808] hover:border-[#444444] transition-colors group"
            >
              <div className="text-xs text-white font-semibold flex items-center gap-1.5 group-hover:underline">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>POST /messages</span>
              </div>
              <p className="mt-2 text-xs text-[#888888] leading-relaxed">
                Interactive write endpoint. Dispatches a structured inquiry payload directly to my email address.
              </p>
            </a>
          </div>

          {/* Terminal Curl Snippet */}
          <div className="p-4 sm:p-5 border border-[#1c1c1c] bg-[#050505] overflow-x-auto text-xs leading-relaxed">
            <div className="text-[#8a8a8a] select-none"># Query live from your own terminal</div>
            <div className="mt-1 text-white font-medium flex items-center gap-2">
              <span className="text-[#03b000] select-none">$</span>
              <span>curl -s https://bayue.my.id/api/projects | jq '.data[].name'</span>
            </div>
            <div className="mt-2 text-[#888888] space-y-0.5">
              <div>"gitSdm"</div>
              <div>"pia-scrap"</div>
              <div>"sketchbook_"</div>
              <div>"keking"</div>
              <div>"novelpia-reader"</div>
              <div>"pixeldrain-bypasser"</div>
              <div>"porto"</div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-[#888888]">
            <a
              href="https://github.com/mbayue"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 hover:text-white transition-colors inline-flex items-center min-h-[36px]"
            >
              github.com/mbayue
            </a>
            <a
              href="https://www.linkedin.com/in/bayuerich/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 hover:text-white transition-colors inline-flex items-center min-h-[36px]"
            >
              linkedin.com/in/bayuerich
            </a>
            <a
              href="mailto:bayu.erich@gmail.com"
              className="py-1 hover:text-white transition-colors inline-flex items-center min-h-[36px]"
            >
              bayu.erich@gmail.com
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-[#181818] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8a8a8a]">
          <p>© {new Date().getFullYear()} Bayu Erich. Built in Indonesia.</p>
          <div className="flex items-center gap-6">
            <Link href="/cv" className="py-1 hover:text-white transition-colors underline underline-offset-2 inline-flex items-center min-h-[36px]">
              Printable CV (/cv)
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="py-1 hover:text-white transition-colors inline-flex items-center gap-1 min-h-[36px]"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to top</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
