// Property-based tests for the pure command module (js/commands.js).
//
// Feature: advanced-devops-portfolio
// These tests are dev-only, run under `node --test`, and use fast-check
// (installed via npm, never bundled into the deployed static site).
//
// Covers design.md "Correctness Properties":
//   - Property 1 (Requirements 2.2, 2.3): command parsing resolves known
//     commands and rejects unknown ones.
//   - Property 2 (Requirements 2.1): help output covers exactly the registry.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import {
    COMMAND_REGISTRY,
    SECTION_IDS,
    UNKNOWN_COMMAND_HINT,
    normalizeInput,
    parseCommand,
    listCommands
} from '../js/commands.js';

const NUM_RUNS = 200;

// The registry command names, used to bias the generator toward inputs that
// should resolve (with random casing / surrounding whitespace) so the "ok"
// branch is exercised heavily, not just by luck of random strings.
const KNOWN_NAMES = Object.keys(COMMAND_REGISTRY);

// Wrap a known command name in random case and whitespace. After
// normalizeInput this must still resolve to the same registry entry, which
// makes it a strong probe for the "ok" branch of parseCommand.
function decorateKnownName(name, upperMask, leadWs, trailWs, innerWs) {
    const cased = name
        .split('')
        .map((ch, i) => (upperMask[i % upperMask.length] ? ch.toUpperCase() : ch))
        .join('');
    // Insert collapsible whitespace runs; normalizeInput trims + collapses
    // internal whitespace to single spaces, so these decorations are lossless
    // for single-token command names.
    return `${leadWs}${cased}${innerWs}${trailWs}`;
}

// Feature: advanced-devops-portfolio, Property 1: For any input string, parseCommand returns { status: "empty" } when the normalized input is empty; otherwise { status: "ok", command } where command is the registry entry whose name equals the normalized input (and for a navigate command, command.section is an existing section id) if such an entry exists; otherwise { status: "unknown", name, hint } where name equals the normalized input and hint references the help command.
test('Property 1: command parsing resolves known commands and rejects unknown ones', () => {
    // Arbitrary that produces either a fully-random string OR a decorated
    // known command name (whitespace + random casing).
    const rawInputArb = fc.oneof(
        // Fully random strings, including empty / whitespace-only ones.
        fc.string(),
        fc.string({ minLength: 0, maxLength: 40 }),
        // Whitespace-only strings to exercise the "empty" branch.
        fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r', '\f', '\v'), { maxLength: 8 }),
        // Decorated known command names to exercise the "ok" branch.
        fc
            .tuple(
                fc.constantFrom(...KNOWN_NAMES),
                fc.array(fc.boolean(), { minLength: 1, maxLength: 12 }),
                fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { maxLength: 4 }),
                fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { maxLength: 4 }),
                fc.stringOf(fc.constantFrom(' ', '\t'), { maxLength: 3 })
            )
            .map(([name, mask, lead, trail, inner]) =>
                decorateKnownName(name, mask, lead, trail, inner)
            )
    );

    fc.assert(
        fc.property(rawInputArb, (raw) => {
            const result = parseCommand(raw);
            const norm = normalizeInput(raw);

            if (norm === '') {
                assert.deepEqual(result, { status: 'empty' });
                return;
            }

            const expected = COMMAND_REGISTRY[norm];
            if (expected) {
                assert.equal(result.status, 'ok');
                // The resolved command must BE the registry entry.
                assert.equal(result.command, expected);
                // ...and its name must equal the normalized input.
                assert.equal(result.command.name, norm);
                // For navigate commands, section must be a real section id.
                if (result.command.type === 'navigate') {
                    assert.ok(
                        SECTION_IDS.includes(result.command.section),
                        `navigate command "${norm}" must target an existing section id`
                    );
                }
            } else {
                assert.equal(result.status, 'unknown');
                // name echoes the normalized input.
                assert.equal(result.name, norm);
                // hint must reference the help command.
                assert.ok(
                    /help/i.test(result.hint),
                    `unknown hint must reference the help command, got: ${result.hint}`
                );
                assert.equal(result.hint, UNKNOWN_COMMAND_HINT);
            }
        }),
        { numRuns: NUM_RUNS }
    );
});

// Feature: advanced-devops-portfolio, Property 2: For any command registry, the output produced for the help command names every command present in the registry and names no command absent from it.
test('Property 2: help output covers exactly the registry', () => {
    // Build an arbitrary registry the same shape the app uses: keyed by name,
    // where each entry's `name` equals its key. Names are unique, non-empty
    // tokens. This lets us assert listCommands enumerates exactly the registry.
    const commandNameArb = fc
        .string({ minLength: 1, maxLength: 16 })
        .map((s) => s.replace(/\s+/g, '')) // command names are single tokens
        .filter((s) => s.length > 0);

    const registryArb = fc
        .uniqueArray(commandNameArb, { minLength: 0, maxLength: 20 })
        .map((names) => {
            /** @type {Record<string, any>} */
            const registry = {};
            for (const name of names) {
                registry[name] = {
                    name,
                    type: 'output',
                    describe: `describe ${name}`,
                    output: `output ${name}`
                };
            }
            return registry;
        });

    fc.assert(
        fc.property(registryArb, (registry) => {
            const listed = listCommands(registry);
            const listedNames = listed.map((c) => c.name);
            const registryNames = Object.keys(registry);

            // No duplicates in the help listing.
            assert.equal(
                new Set(listedNames).size,
                listedNames.length,
                'help output must not list a command more than once'
            );

            // Every command in the registry is named (coverage).
            for (const name of registryNames) {
                assert.ok(
                    listedNames.includes(name),
                    `help output must name registry command "${name}"`
                );
            }

            // No command named that is absent from the registry (soundness).
            for (const name of listedNames) {
                assert.ok(
                    Object.prototype.hasOwnProperty.call(registry, name),
                    `help output must not name absent command "${name}"`
                );
            }

            // Exactly the registry: set equality of names.
            assert.deepEqual(new Set(listedNames), new Set(registryNames));
        }),
        { numRuns: NUM_RUNS }
    );
});

// Additionally pin Property 2 against the real default registry so a
// regression in COMMAND_REGISTRY / listCommands is caught directly.
test('Property 2: help output covers exactly the default COMMAND_REGISTRY', () => {
    const listedNames = listCommands().map((c) => c.name);
    assert.deepEqual(new Set(listedNames), new Set(Object.keys(COMMAND_REGISTRY)));
});
