// Integration tests for the Contact_Form (Requirement 6).
// Feature: advanced-devops-portfolio
//
// 12.2: valid submit POSTs + success (6.4); invalid shows per-field errors and
// does NOT POST (6.3); failure/timeout shows failure + email fallback (6.5).

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDom } from "./jsdom-setup.mjs";

const settle = () => new Promise((r) => setTimeout(r, 0));

test("6.4: valid submission POSTs to Formspree and shows success", async () => {
    makeDom();
    const { window } = globalThis;
    let posted = null;
    globalThis.fetch = async (url, opts) => { posted = { url, opts }; return { ok: true, status: 200, json: async () => ({}) }; };
    const { initContactForm } = await import("../js/contact-form.js");
    initContactForm();

    document.getElementById("name").value = "Ada";
    document.getElementById("email").value = "ada@example.com";
    document.getElementById("message").value = "Hello there";
    document.getElementById("contactForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

    await settle();
    assert.ok(posted, "POST was sent");
    assert.ok(posted.url.includes("formspree.io"), "posted to Formspree endpoint");
    assert.equal(JSON.parse(posted.opts.body).name, "Ada");
    const status = document.getElementById("formStatus");
    assert.ok(/sent/i.test(status.textContent), "success message shown");
    assert.ok(status.className.includes("success"));
});

test("6.3: invalid submission shows per-field errors and does NOT POST", async () => {
    makeDom();
    const { window } = globalThis;
    let posted = false;
    globalThis.fetch = async () => { posted = true; return { ok: true, json: async () => ({}) }; };
    const { initContactForm } = await import("../js/contact-form.js");
    initContactForm();

    document.getElementById("name").value = "   ";
    document.getElementById("email").value = "not-an-email";
    document.getElementById("message").value = "";
    document.getElementById("contactForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

    await settle();
    assert.equal(posted, false, "no POST for invalid input");
    assert.ok(document.getElementById("name-error").textContent.length > 0);
    assert.ok(document.getElementById("email-error").textContent.length > 0);
    assert.ok(document.getElementById("message-error").textContent.length > 0);
});

test("6.5: failure/timeout shows failure with direct email fallback", async () => {
    makeDom();
    const { window } = globalThis;
    globalThis.fetch = async () => { throw new Error("network down"); };
    const { initContactForm } = await import("../js/contact-form.js");
    initContactForm();

    document.getElementById("name").value = "Ada";
    document.getElementById("email").value = "ada@example.com";
    document.getElementById("message").value = "Hello there";
    document.getElementById("contactForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

    await settle();
    const status = document.getElementById("formStatus");
    assert.ok(status.className.includes("error"), "failure status shown");
    assert.ok(/singh\.ritooraj@gmail\.com/.test(status.textContent), "direct email offered");
    assert.ok(status.textContent.includes("mailto:"), "mailto fallback present");
});
