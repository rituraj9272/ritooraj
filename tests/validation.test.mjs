// Property-based tests for the pure contact-validation module (js/validation.js).
//
// Uses Node's built-in test runner (`node --test`) with fast-check.
// fast-check is resolved via a global install exposed through NODE_PATH
// (see the run command in the task notes) so nothing is bundled or committed.

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { isValidEmail, validateContactForm } from "../js/validation.js";

// The three fields under test. Used to assert that `errors` contains a key for
// each failing field and no key for any passing field.
const FIELDS = ["name", "email", "message"];

// Independent oracle for each field rule, mirroring the design spec exactly:
//  - name/message : a string that is non-empty after trimming
//  - email        : syntactically valid per isValidEmail (the defined notion)
const nameOrMessageValid = (v) => typeof v === "string" && v.trim().length > 0;
const emailValid = (v) => isValidEmail(v);

// A generator that yields a syntactically-plausible email like "a.b@c.io".
const validishEmail = fc
  .tuple(
    fc.stringMatching(/^[a-z0-9]+$/).filter((s) => s.length > 0),
    fc.stringMatching(/^[a-z0-9]+$/).filter((s) => s.length > 0),
    fc.constantFrom("io", "com", "dev", "co", "org")
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

// A field value generator that intentionally spans the whole input space:
// clearly-valid strings, empty/whitespace-only strings, arbitrary unicode
// strings, valid-ish emails, and occasional non-string values. This keeps the
// generator constrained to realistic contact-form inputs while still exercising
// both the passing and failing side of every rule.
const fieldValue = fc.oneof(
  fc.string(),
  fc.string().map((s) => `  ${s}  `),
  fc.constantFrom("", " ", "\t", "\n", "   "),
  validishEmail,
  fc.constantFrom("not-an-email", "a@b", "@x.com", "x@.com", "x y@z.com"),
  fc.constantFrom(undefined, null, 42, {}, [])
);

// Feature: advanced-devops-portfolio, Property 4: For any { name, email, message } input, validateContactForm returns valid === true with no error keys if and only if name is non-empty after trimming, email is syntactically valid, and message is non-empty after trimming; and whenever valid === false, errors contains an entry for each field that fails its rule and no entry for any field that passes.
test("Property 4: contact validation is correct and complete", () => {
  fc.assert(
    fc.property(fieldValue, fieldValue, fieldValue, (name, email, message) => {
      const submission = { name, email, message };
      const result = validateContactForm(submission);

      // Independent, per-field expectation of validity.
      const expected = {
        name: nameOrMessageValid(name),
        email: emailValid(email),
        message: nameOrMessageValid(message),
      };
      const expectedValid = expected.name && expected.email && expected.message;

      // IFF: overall validity matches the conjunction of the three rules.
      assert.equal(
        result.valid,
        expectedValid,
        `valid mismatch for ${JSON.stringify(submission)}`
      );

      // valid === true implies no error keys at all.
      if (result.valid) {
        assert.deepEqual(Object.keys(result.errors), []);
      }

      // Completeness + soundness of the error map: exactly one entry per
      // failing field, and no entry for any passing field.
      for (const field of FIELDS) {
        const failing = !expected[field];
        const hasKey = Object.prototype.hasOwnProperty.call(
          result.errors,
          field
        );
        assert.equal(
          hasKey,
          failing,
          `errors["${field}"] presence=${hasKey} but expected=${failing} for ${JSON.stringify(
            submission
          )}`
        );
      }

      // No stray error keys beyond the three known fields.
      for (const key of Object.keys(result.errors)) {
        assert.ok(FIELDS.includes(key), `unexpected error key "${key}"`);
      }
    }),
    { numRuns: 300 }
  );
});
