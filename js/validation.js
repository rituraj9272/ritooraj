// ===========================
// PURE: email + contact form validation (no DOM)
// Implemented in Task 4.
//
// This module is intentionally free of any DOM access so it can be
// property-tested in Node. See design.md -> Contact_Form -> validation.js
// and Data Models -> Contact Submission for the exact interface.
// ===========================

/**
 * Syntactic, RFC-pragmatic email check.
 *
 * This is deliberately not a full RFC 5322 parser (which is impractical and
 * rejects almost nothing useful in a browser form). It enforces the common,
 * practical shape: a non-empty local part, a single "@", and a domain with at
 * least one dot-separated label and a TLD of two or more characters. No
 * whitespace is allowed anywhere.
 *
 * @param {string} value
 * @returns {boolean} true when the value is a syntactically valid email
 */
export function isValidEmail(value) {
  if (typeof value !== "string") {
    return false;
  }

  // No leading/trailing whitespace and no internal whitespace allowed.
  if (value !== value.trim() || value.length === 0) {
    return false;
  }
  if (/\s/.test(value)) {
    return false;
  }

  // local-part@domain with a dotted domain and a 2+ char TLD.
  // local: one or more chars that are not whitespace, "@", or ".."-style dots at edges.
  const EMAIL_RE =
    /^[^\s@]+(?:\.[^\s@]+)*@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}$/;

  return EMAIL_RE.test(value);
}

/**
 * Validate a contact form submission.
 *
 * Rules (design.md, Requirements 6.2 / 6.3):
 *  - name    : non-empty after trim
 *  - email   : syntactically valid (isValidEmail)
 *  - message : non-empty after trim
 *
 * The returned `errors` object contains an entry for EACH failing field and
 * NO entry for passing fields. `valid` is true iff there are no failing fields.
 *
 * @param {{ name?: unknown, email?: unknown, message?: unknown }} submission
 * @returns {{ valid: boolean, errors: { name?: string, email?: string, message?: string } }}
 */
export function validateContactForm(submission) {
  const { name, email, message } = submission || {};
  const errors = {};

  if (!isNonEmptyTrimmed(name)) {
    errors.name = "Name is required.";
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    errors.email = "A valid email address is required.";
  }

  if (!isNonEmptyTrimmed(message)) {
    errors.message = "Message is required.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Internal helper: true when the value is a string that is non-empty after trim.
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonEmptyTrimmed(value) {
  return typeof value === "string" && value.trim().length > 0;
}
