import { expect, mock, test } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";

// Mirror tests/terminal-hydration.test.mjs: control what the browser's
// media preference reports, then compare SSR HTML against it.
const framerMotion = await import("framer-motion");
let reducedMotion = null;
mock.module("framer-motion", () => ({
  ...framerMotion,
  useReducedMotion: () => reducedMotion,
}));
const { default: SystemDiagram } = await import("../src/components/SystemDiagram.tsx");

test("SystemDiagram SSR HTML matches a reduced-motion client (no hydration mismatch)", () => {
  reducedMotion = null; // server: no matchMedia
  const serverHtml = renderToString(React.createElement(SystemDiagram));
  reducedMotion = true; // client with prefers-reduced-motion: reduce
  const clientHtml = renderToString(React.createElement(SystemDiagram));

  expect(clientHtml).toBe(serverHtml);
});

test("SystemDiagram SSR output is deterministic", () => {
  reducedMotion = null;
  const first = renderToString(React.createElement(SystemDiagram));
  const second = renderToString(React.createElement(SystemDiagram));

  expect(second).toBe(first);
});
