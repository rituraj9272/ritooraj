// Integration tests for the GitHub_Data_Service (Requirement 4).
// Feature: advanced-devops-portfolio
//
// 11.2: correct URLs requested (4.1); success renders count/language (4.2);
// failure renders fallback with no error (4.3); featured repos always render (4.4);
// session cache avoids a second network call (4.1).
//
// makeDom() is called before importing the product module.

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDom } from "./jsdom-setup.mjs";

function makeStorage() {
    const m = new Map();
    return {
        getItem: (k) => (m.has(k) ? m.get(k) : null),
        setItem: (k, v) => m.set(k, v),
        removeItem: (k) => m.delete(k)
    };
}

async function fakeFetch(urls, { ok = true, reject = false } = {}) {
    const seen = [];
    const fn = async (url) => {
        seen.push(String(url));
        if (reject) throw new Error("network down");
        if (!ok) return { ok: false, json: async () => ({}) };
        if (String(url).endsWith("ritooraj01")) {
            return { ok: true, json: async () => ({ public_repos: 42, login: "ritooraj01" }) };
        }
        return {
            ok: true,
            json: async () => ([
                { name: "alb-observability-automation", language: "HCL", stargazers_count: 5, html_url: "x", description: "x" },
                { name: "assistant-ai", language: "JavaScript", stargazers_count: 3, html_url: "y", description: "y" }
            ])
        };
    };
    fn.seen = seen;
    return fn;
}

test("4.1/4.2: requests user + repos and renders live stats", async () => {
    makeDom();
    const { loadGitHubData, renderGitHub } = await import("../js/github-service.js");
    const fetchImpl = await fakeFetch();
    const storage = makeStorage();

    const data = await loadGitHubData({ fetchImpl, storage, timeoutMs: 1000 });
    assert.ok(fetchImpl.seen.some((u) => u.includes("/users/ritooraj01") && !u.includes("/repos")));
    assert.ok(fetchImpl.seen.some((u) => u.includes("/repos")));

    await renderGitHub(data);
    assert.equal(document.getElementById("ghRepoCount").textContent, "42");
    assert.equal(document.getElementById("ghPrimaryLanguage").textContent, "HCL");
    assert.equal(document.getElementById("featuredRepos").querySelectorAll(".featured-repo").length, 5);
});

test("4.3/4.4: failure resolves to fallback and still renders featured repos", async () => {
    makeDom();
    const { loadGitHubData, renderGitHub } = await import("../js/github-service.js");
    const fetchImpl = await fakeFetch([], { reject: true });
    const storage = makeStorage();

    const data = await loadGitHubData({ fetchImpl, storage, timeoutMs: 200 });
    assert.equal(data.stats.live, false, "fallback used");
    await renderGitHub(data);
    assert.equal(document.getElementById("ghRepoCount").textContent, "12");
    assert.equal(document.getElementById("ghPrimaryLanguage").textContent, "Python");
    assert.equal(document.getElementById("featuredRepos").querySelectorAll(".featured-repo").length, 5);
});

test("4.1: session cache avoids a network call on second load", async () => {
    makeDom();
    const { loadGitHubData } = await import("../js/github-service.js");
    const fetchImpl = await fakeFetch();
    let networkCalls = 0;
    const counting = async (url, opts) => { networkCalls++; return fetchImpl(url, opts); };
    const storage = makeStorage();

    await loadGitHubData({ fetchImpl: counting, storage, timeoutMs: 1000 });
    const afterFirst = networkCalls;
    await loadGitHubData({ fetchImpl: counting, storage, timeoutMs: 1000 });
    assert.ok(afterFirst > 0, "first load hit network");
    assert.equal(networkCalls, afterFirst, "second load served from cache");
});
