// Example tests for the Theme_Controller (Requirement 8).
// Feature: advanced-devops-portfolio
//
// 7.2: Toggle flips and persists (8.1, 8.2); persisted theme applied on load
// (8.3); default dark when unset (8.4). DOM is driven via jsdom-setup.

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDom } from "./jsdom-setup.mjs";
import {
    initTheme,
    resolveInitialTheme,
    nextTheme,
    THEME_STORAGE_KEY
} from "../js/theme-controller.js";

// --- PURE helpers (8.3, 8.4, 8.1) ---
test("resolveInitialTheme: returns persisted dark/light, else default dark", () => {
    assert.equal(resolveInitialTheme("dark"), "dark");
    assert.equal(resolveInitialTheme("light"), "light");
    assert.equal(resolveInitialTheme("garbage"), "dark");
    assert.equal(resolveInitialTheme(null), "dark");
    assert.equal(resolveInitialTheme(undefined), "dark");
});

test("nextTheme: toggles dark <-> light", () => {
    assert.equal(nextTheme("dark"), "light");
    assert.equal(nextTheme("light"), "dark");
    assert.equal(nextTheme("dark"), "light");
});

// --- DOM behaviour ---
test("initTheme: default dark when nothing persisted (8.4)", () => {
    makeDom();
    localStorage.clear();
    initTheme();
    assert.equal(document.documentElement.getAttribute("data-theme"), "dark");
});

test("initTheme: applies persisted theme on load (8.3)", () => {
    makeDom();
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    initTheme();
    assert.equal(document.documentElement.getAttribute("data-theme"), "light");
});

test("initTheme: toggle flips theme and persists (8.1, 8.2)", () => {
    makeDom();
    localStorage.clear();
    initTheme();
    const toggle = document.querySelector(".theme-toggle");
    assert.ok(toggle, "theme toggle present");

    // Start dark -> click -> light + persisted.
    assert.equal(document.documentElement.getAttribute("data-theme"), "dark");
    toggle.click();
    assert.equal(document.documentElement.getAttribute("data-theme"), "light");
    assert.equal(localStorage.getItem(THEME_STORAGE_KEY), "light");

    // Click again -> dark.
    toggle.click();
    assert.equal(document.documentElement.getAttribute("data-theme"), "dark");
    assert.equal(localStorage.getItem(THEME_STORAGE_KEY), "dark");
});
