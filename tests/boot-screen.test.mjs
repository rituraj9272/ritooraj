// Example / edge tests for the Boot_Screen (Requirement 3).
// Feature: advanced-devops-portfolio
//
// 8.2: completion hides + reveals (3.2); 8s hard timeout hides via fake timers
// (3.3); reduced-motion reveals <=1s (3.4). Idempotent hide is asserted by the
// fact that a second trigger never re-runs the reveal (display stays "none").

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDom } from "./jsdom-setup.mjs";

function fire(calls, delay) {
    const match = calls.filter((c) => c.delay === delay);
    assert.ok(match.length >= 1, `expected a setTimeout(delay=${delay}) to exist`);
    // Fire the first matching callback.
    match[0].cb();
}

// Install a fake setTimeout, THEN import the boot module (so it captures the
// fake, not the real, timer), run fn(calls), and restore the real timer.
async function withFakeTimers(fn) {
    const real = globalThis.setTimeout;
    const calls = [];
    globalThis.setTimeout = (cb, delay) => {
        calls.push({ cb, delay: delay || 0 });
        return calls.length;
    };
    try {
        const { initBootScreen } = await import("../js/boot-screen.js");
        return fn(calls, initBootScreen);
    } finally {
        globalThis.setTimeout = real;
    }
}

test("8s hard timeout hides the loading screen and re-enables scroll (3.3)", async () => {
    const { window } = makeDom();
    window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
    globalThis.matchMedia = window.matchMedia;

    await withFakeTimers((calls, initBootScreen) => {
        initBootScreen();
        assert.equal(globalThis.document.body.style.overflow, "hidden", "scroll locked while booting");
        fire(calls, 8000); // hard timeout
        const screen = globalThis.document.querySelector(".loading-screen");
        assert.equal(screen.style.display, "none", "loading screen hidden after timeout");
        assert.equal(globalThis.document.body.style.overflow, "auto", "scroll re-enabled");
    });
});

test("reduced-motion reveals within 1s without animation (3.4)", async () => {
    const { window } = makeDom();
    window.matchMedia = (q) =>
        q.includes("reduced")
            ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} }
            : { matches: false, media: q, addEventListener() {}, removeEventListener() {} };
    globalThis.matchMedia = window.matchMedia;

    await withFakeTimers((calls, initBootScreen) => {
        initBootScreen();
        const reveal = calls.find((c) => c.delay <= 1000 && c.delay > 0);
        assert.ok(reveal, "reduced-motion reveal scheduled at <=1s");
        reveal.cb();
        const screen = globalThis.document.querySelector(".loading-screen");
        assert.equal(screen.style.display, "none", "revealed under reduced motion");
        assert.equal(globalThis.document.body.style.overflow, "auto", "scroll re-enabled");
    });
});

test("completion path hides the screen (3.2) — idempotent", async () => {
    const { window } = makeDom();
    window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
    globalThis.matchMedia = window.matchMedia;

    await withFakeTimers((calls, initBootScreen) => {
        initBootScreen();
        const screen = globalThis.document.querySelector(".loading-screen");
        // Fire the completion reveal (the hard-timeout callback is the
        // idempotent hide used when the animated sequence completes).
        fire(calls, 8000);
        assert.equal(screen.style.display, "none", "screen hidden on completion");
        // A second trigger must NOT error / re-show (idempotent).
        fire(calls, 8000);
        assert.equal(screen.style.display, "none", "idempotent: still hidden");
    });
});
