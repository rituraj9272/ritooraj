// Tests for the Command_Terminal.
// Feature: advanced-devops-portfolio
//
// 10.2 (Property 3): history preserves submission order + pairing (PURE reducer).
// 10.3: clear empties output (2.4); unknown command shows error (2.3).
//
// NOTE: makeDom() is called (and globals are set) BEFORE importing the product
// module, so the module initializes against the jsdom document.

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { makeDom } from "./jsdom-setup.mjs";

const SECTION_IDS = ["home", "about", "skills", "projects", "architecture", "experience", "certifications", "contact"];
const knownNames = ["help", "about", "projects", "contact", "whoami", "info", "skills", "home", "clear"];
const inputArb = fc
    .tuple(
        fc.constantFrom(...knownNames),
        fc.array(fc.boolean(), { minLength: 0, maxLength: 4 }),
        fc.stringOf(fc.constantFrom(" ", "\t"), { maxLength: 2 })
    )
    .map(([name, mask, ws]) => {
        const cased = name.split("").map((c, i) => (mask[i % mask.length] ? c.toUpperCase() : c)).join("");
        return `${ws}${cased}${ws}`;
    });

// Feature: advanced-devops-portfolio, Property 3: Command history preserves submission order and pairing
test("Property 3: history preserves submission order and pairing", async () => {
    makeDom();
    const { applyCommand } = await import("../js/terminal.js");
    fc.assert(
        fc.property(fc.array(inputArb, { maxLength: 30 }), (inputs) => {
            let history = [];
            for (const raw of inputs) {
                history = applyCommand(history, raw, SECTION_IDS);
            }
            for (const entry of history) {
                assert.equal(typeof entry.command, "string");
                assert.equal(typeof entry.output, "string");
                assert.equal(typeof entry.isError, "boolean");
            }
            const tail = [];
            for (const raw of [...inputs].reverse()) {
                const norm = raw.trim().toLowerCase();
                if (norm === "clear") break;
                if (norm === "") continue;
                tail.unshift(norm);
            }
            const actual = history.map((e) => e.command.trim().toLowerCase());
            assert.deepEqual(actual, tail, "history tail matches submission order");
        }),
        { numRuns: 120 }
    );
});

test("DOM: submitting commands renders output in order; clear empties it (2.4, 2.5)", async () => {
    makeDom();
    const { window } = globalThis;
    const { initTerminal } = await import("../js/terminal.js");
    initTerminal();
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    assert.ok(input && output, "terminal input/output present");

    const submit = (value) => {
        input.value = value;
        input.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    };
    submit("about");
    submit("projects");
    submit("whoami");

    const lines = output.querySelectorAll(".terminal-cmd-line");
    assert.equal(lines.length, 3, "three commands rendered in order");
    assert.ok(lines[0].textContent.includes("about"));
    assert.ok(lines[1].textContent.includes("projects"));
    assert.ok(lines[2].textContent.includes("whoami"));

    submit("clear");
    assert.equal(output.querySelectorAll(".terminal-cmd-line").length, 0, "clear removed output");
});

test("DOM: unknown command shows error referencing help (2.3)", async () => {
    makeDom();
    const { window } = globalThis;
    const { initTerminal } = await import("../js/terminal.js");
    initTerminal();
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    input.value = "notarealcommand";
    input.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const err = output.querySelector(".terminal-cmd-error");
    assert.ok(err, "error line rendered");
    assert.ok(/help/i.test(err.textContent), "error references help");
});
