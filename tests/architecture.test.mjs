// Example tests for the interactive Architecture_Diagram (Requirement 5).
// Feature: advanced-devops-portfolio
//
// 15.2: hover/focus applies highlight (5.2); intersection toggles the flow
//       class (5.3). Uses jsdom + the controllable observer wiring in
//       wireDiagram (which accepts an injected observe fn for tests).

import { test } from "node:test";
import assert from "node:assert/strict";
// Import the jsdom harness BEFORE the product module so window/document exist
// when architecture.js (and its reduced-motion dependency) initialize.
import { makeDom } from "./jsdom-setup.mjs";
import { buildPipelineSvg, wireDiagram } from "../js/architecture.js";

test("5.2: hover and keyboard focus highlight a node", () => {
    makeDom();
    const { window } = globalThis;
    const svg = buildPipelineSvg("CI/CD Pipeline", [
        { label: "GitHub", icon: "fab fa-github" },
        { label: "Jenkins", icon: "fas fa-hammer" }
    ]);
    wireDiagram(svg);
    const node = svg.querySelector(".arch-node");
    assert.ok(node, "node present");

    node.dispatchEvent(new window.Event("mouseenter"));
    assert.ok(node.classList.contains("is-highlighted"), "highlight on hover");

    node.dispatchEvent(new window.Event("mouseleave"));
    assert.ok(!node.classList.contains("is-highlighted"), "unhighlight on leave");

    node.dispatchEvent(new window.Event("focus"));
    assert.ok(node.classList.contains("is-highlighted"), "highlight on focus (keyboard)");

    node.dispatchEvent(new window.Event("blur"));
    assert.ok(!node.classList.contains("is-highlighted"), "unhighlight on blur");
});

test("5.3: entering the viewport adds the flow class; leaving removes it", () => {
    makeDom();
    const svg = buildPipelineSvg("CI/CD Pipeline", [
        { label: "GitHub", icon: "fab fa-github" }
    ]);
    let startFlow = null;
    let stopFlow = null;
    wireDiagram(svg, (_el, start, stop) => {
        startFlow = start;
        stopFlow = stop;
    });

    assert.ok(!svg.classList.contains("in-view"), "not in view initially");
    startFlow();
    assert.ok(svg.classList.contains("in-view"), "in-view added when intersecting");
    stopFlow();
    assert.ok(!svg.classList.contains("in-view"), "in-view removed when out of view");
});
