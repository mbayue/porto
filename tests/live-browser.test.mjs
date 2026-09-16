import { test, expect, describe, beforeAll } from "bun:test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

describe("Live Web & Browser Integrity Suite", () => {
  let html = "";
  let headers = new Headers();
  let status = 0;

  beforeAll(async () => {
    const res = await fetch(BASE_URL, {
      headers: { "User-Agent": "BunLiveBrowserTest/1.0" },
    });
    status = res.status;
    headers = res.headers;
    html = await res.text();
  });

  describe("1. Server & HTTP Protocol", () => {
    test("Root endpoint returns 200 OK", () => {
      expect(status).toBe(200);
    });

    test("Content-Type header is text/html with utf-8", () => {
      const ct = headers.get("content-type") || "";
      expect(ct).toContain("text/html");
    });

    test("CV asset /cv-bayu-erich.pdf is reachable", async () => {
      const res = await fetch(`${BASE_URL}/cv-bayu-erich.pdf`);
      expect(res.status).toBe(200);
    });

    test("Favicon asset /favicon.svg is reachable", async () => {
      const res = await fetch(`${BASE_URL}/favicon.svg`);
      expect(res.status).toBe(200);
    });
  });

  describe("2. Document Metadata & SEO", () => {
    test("HTML contains lang and proper title", () => {
      expect(html).toContain('lang="en"');
      expect(html).toContain("<title>Bayu Erich — Backend Engineer</title>");
    });

    test("Meta description and OpenGraph tags are populated", () => {
      expect(html).toContain('name="description"');
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:type"');
    });

    test("Theme script hydration guard is present in head", () => {
      expect(html).toContain("portfolio-theme");
      expect(html).toContain("dataset.theme");
    });
  });

  describe("3. Accessibility & Interactive Semantics", () => {
    test("Skip link exists for keyboard navigation", () => {
      expect(html).toContain('class="skip-link"');
      expect(html).toContain('href="#main"');
    });

    test("All interactive buttons specify explicit type='button'", () => {
      const buttonMatches = html.match(/<button[^>]*>/g) || [];
      expect(buttonMatches.length).toBeGreaterThan(0);
      for (const btn of buttonMatches) {
        expect(btn).toContain('type="button"');
      }
    });

    test("Theme toggle has aria-label and aria-pressed", () => {
      expect(html).toMatch(/class="theme-toggle"[^>]*aria-label=/);
      expect(html).toMatch(/class="theme-toggle"[^>]*aria-pressed=/);
    });

    test("Decorative status dots have aria-hidden='true'", () => {
      const dots = html.match(/class="status-dot"[^>]*aria-hidden="true"/g) || [];
      expect(dots.length).toBeGreaterThanOrEqual(2);
    });

    test("Form/terminal input has autoCapitalize, spellCheck, and typographic ellipsis", () => {
      expect(html).toMatch(/spellcheck="false"/i);
      expect(html).toMatch(/autocapitalize="none"/i);
      expect(html).toContain('placeholder="Type command here…"');
    });
  });

  describe("4. Structural Sections & IDs", () => {
    const requiredSections = [
      "hero",
      "projects",
      "experience",
      "skills",
      "about",
      "contact",
    ];

    for (const sectionId of requiredSections) {
      test(`Section id="#${sectionId}" exists in DOM`, () => {
        expect(html).toContain(`id="${sectionId}"`);
      });
    }

    test("Main site header and footer are present", () => {
      expect(html).toContain('class="site-header"');
      expect(html).toContain('class="site-footer"');
      expect(html).toContain("bayue.");
    });
  });

  describe("5. Bespoke Project Visuals (Anti-Slop Craft)", () => {
    const projects = [
      { name: "gitSdm", marker: "repo-graph" },
      { name: "pia-scrap", marker: "scrape-flow" },
      { name: "sketchbook_", marker: "SKETCH" },
      { name: "keking", marker: "!play" },
      { name: "novelpia-reader", marker: "YOUR LIBRARY. AVAILABLE OFFLINE." },
      { name: "pixeldrain-bypasser", marker: "album.zip · done" },
      { name: "porto", marker: "bayue · portfolio" },
    ];

    for (const { name, marker } of projects) {
      test(`Project "${name}" renders bespoke visual marker "${marker}"`, () => {
        expect(html).toContain(marker);
      });
    }

    test("Project filters include 'All work' and category buttons", () => {
      expect(html).toContain('class="project-filters"');
      expect(html).toContain("All work");
    });
  });

  describe("6. Backend Architecture Diagram", () => {
    test("System Diagram has accessible role and label", () => {
      expect(html).toContain('role="img"');
      expect(html).toContain("Backend architecture illustration");
    });

    test("Diagram nodes are present (Client, Backend API, Database, Worker)", () => {
      expect(html).toContain("Client request");
      expect(html).toContain("THE BACKEND");
      expect(html).toContain("Database");
      expect(html).toContain("Worker");
    });
  });

  describe("7. Skills Bento & Terminal", () => {
    test("Skills grid contains all 5 categories", () => {
      expect(html).toContain("Languages");
      expect(html).toContain("Backend");
      expect(html).toContain("Databases");
      expect(html).toContain("Cloud");
      expect(html).toContain("DevOps");
    });

    test("Terminal disclosure component is present", () => {
      expect(html).toContain('class="terminal-disclosure"');
      expect(html).toContain("INITIALIZING BAYU_ERICH_SHELL");
    });
  });
});
