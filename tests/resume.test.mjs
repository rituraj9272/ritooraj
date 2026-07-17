// Example test for the résumé path resolution (Requirement 7.4).
// Feature: advanced-devops-portfolio
//
// 13.2: a mocked 404 on the primary path rewrites the link to the actual PDF;
//       a 200 keeps the normalized href.

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDom } from "./jsdom-setup.mjs";

const settle = () => new Promise((r) => setTimeout(r, 0));

test("7.4: primary path 404 falls back to the actual PDF", async () => {
    makeDom();
    globalThis.fetch = async (url) =>
        String(url).includes("resume.pdf") ? { ok: false, status: 404 } : { ok: true, status: 200 };
    const { initResumeLink } = await import("../js/contact-form.js");
    initResumeLink();
    await settle();
    assert.equal(document.getElementById("resumeLink").getAttribute("href"), "RES/Rituraj_devops (8).pdf");
});

test("7.4: primary path resolves keeps the normalized href", async () => {
    makeDom();
    globalThis.fetch = async () => ({ ok: true, status: 200 });
    const { initResumeLink } = await import("../js/contact-form.js");
    initResumeLink();
    await settle();
    assert.equal(document.getElementById("resumeLink").getAttribute("href"), "RES/resume.pdf");
});
