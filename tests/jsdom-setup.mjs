// Shared dev-only jsdom harness for DOM-facing tests.
//
// Loads the real index.html so controllers find the element IDs they expect,
// then publishes jsdom globals (window, document, IntersectionObserver,
// matchMedia, AbortController, localStorage) onto globalThis BEFORE any product
// module is imported. Product modules read these at call time, so importing this
// module first is sufficient.
//
// makeDom() is idempotent: the JSDOM instance and global bindings are created
// once. Repeated calls reset the document body + storage so each test starts
// from a clean page without re-assigning read-only globals.
//
// Feature: advanced-devops-portfolio — supporting tests for tasks 7.2, 8.2,
// 10.2, 10.3, 11.2, 12.2, 13.2, 15.2.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, "..", "index.html");
const HTML = readFileSync(htmlPath, "utf8");

let MockIntersectionObserver = null;

// Controllable IntersectionObserver mock. Tests can fire visibility by calling
// the captured start/stop callbacks (see architecture.test.mjs).
function makeMockIO() {
    class IO {
        constructor(cb) {
            this.cb = cb;
            IO.instances.push(this);
        }
        observe(el) { IO.targets.set(el, this); }
        unobserve(el) { IO.targets.delete(el); }
        disconnect() {}
    }
    IO.instances = [];
    IO.targets = new Map();
    return IO;
}

export function makeDom() {
    const dom = new JSDOM(HTML, { url: "https://ritooraj01.github.io/", pretendToBeVisual: true });
    const { window } = dom;

    if (!window.matchMedia) {
        window.matchMedia = (q) => ({
            matches: false, media: q,
            addListener() {}, removeListener() {},
            addEventListener() {}, removeEventListener() {}
        });
    }

    MockIntersectionObserver = makeMockIO();

    // Publish globals (window/document/localStorage are not read-only globals,
    // so re-publishing per call is safe; navigator is intentionally untouched).
    globalThis.window = window;
    globalThis.document = window.document;
    globalThis.HTMLElement = window.HTMLElement;
    globalThis.Node = window.Node;
    globalThis.localStorage = window.localStorage;
    globalThis.IntersectionObserver = MockIntersectionObserver;
    globalThis.matchMedia = window.matchMedia;
    globalThis.MutationObserver = window.MutationObserver;
    if (typeof globalThis.AbortController === "undefined" && window.AbortController) {
        globalThis.AbortController = window.AbortController;
    }

    return { window, MockIntersectionObserver };
}
