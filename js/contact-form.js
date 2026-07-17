// ===========================
// Contact_Form controller (Requirement 6) + résumé path resolution (Requirement 7)
//
//   6.1 fields for name / email / message
//   6.2 valid -> POST to Formspree (10s timeout), no validation message
//   6.3 invalid -> per-field errors, do NOT POST
//   6.4 success -> success message
//   6.5 error/timeout -> failure message incl. direct email + mailto fallback
//   6.6 no secret credential embedded (public form endpoint only)
//   7.4 defensive résumé path: if primary path 404s, rewrite to actual PDF
//
// submitContact() is the testable pure-ish core: it takes validated fields and
// an injectable fetch, and resolves to { ok } or { ok:false, reason } based on
// the Formspree response / timeout. (See tests/contact-form.test.mjs)
// ===========================

import { validateContactForm } from './validation.js';
import { CONFIG } from './config.js';

/**
 * POST a validated submission to Formspree with a 10s AbortController timeout.
 * Resolves { ok: true } on 2xx, { ok:false, reason } otherwise. NEVER rejects.
 *
 * @param {{ name: string, email: string, message: string }} fields
 * @param {object} [deps]
 * @param {Function} [deps.fetchImpl=globalThis.fetch]
 * @param {string} [deps.endpoint=CONFIG.formEndpoint]
 * @param {number} [deps.timeoutMs=CONFIG.formTimeoutMs]
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function submitContact(fields, deps = {}) {
    const fetchImpl = deps.fetchImpl || globalThis.fetch;
    const endpoint = deps.endpoint || CONFIG.formEndpoint;
    const timeoutMs = deps.timeoutMs || CONFIG.formTimeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetchImpl(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(fields),
            signal: controller.signal
        });
        if (res.ok) return { ok: true };
        return { ok: false, reason: 'error' };
    } catch (_err) {
        return { ok: false, reason: 'timeout' };
    } finally {
        clearTimeout(timer);
    }
}

export function initContactForm() {
    const doc = globalThis.document;
    const form = doc.getElementById('contactForm');
    if (!form) return;

    const nameEl = doc.getElementById('name');
    const emailEl = doc.getElementById('email');
    const messageEl = doc.getElementById('message');
    const statusEl = doc.getElementById('formStatus');
    if (!nameEl || !emailEl || !messageEl || !statusEl) return;

    const errorEls = {
        name: doc.getElementById('name-error'),
        email: doc.getElementById('email-error'),
        message: doc.getElementById('message-error')
    };

    function setErrors(errors) {
        for (const field of ['name', 'email', 'message']) {
            const el = errorEls[field];
            if (!el) continue;
            const msg = errors[field];
            el.textContent = msg || '';
            el.style.display = msg ? 'block' : 'none';
            const input = { name: nameEl, email: emailEl, message: messageEl }[field];
            if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        }
    }

    function setStatus(message, kind) {
        statusEl.textContent = message;
        statusEl.className = `form-status${kind ? ' form-status-' + kind : ''}`;
        statusEl.style.display = message ? 'block' : 'none';
    }

    function mailtoFallback(fields) {
        const subject = encodeURIComponent(`Portfolio Contact from ${fields.name}`);
        const body = encodeURIComponent(
            `Name: ${fields.name}\nEmail: ${fields.email}\n\nMessage:\n${fields.message}`
        );
        return `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('', null);

        const fields = {
            name: nameEl.value,
            email: emailEl.value,
            message: messageEl.value
        };

        const { valid, errors } = validateContactForm(fields);

        if (!valid) {
            setErrors(errors); // 6.3 — short-circuit before any network call
            return;
        }
        setErrors({}); // 6.2 — valid, no validation message

        // When Formspree is not configured (formspreeEnabled: false or placeholder
        // {formId} in the endpoint), bypass the network call entirely and fall
        // straight through to the prefilled mailto: link so the form is always
        // operational without an account (Requirement 6.5, config.js comment).
        if (!CONFIG.formspreeEnabled || CONFIG.formEndpoint.includes('{formId}')) {
            showMailtoFallback(fields);
            return;
        }

        setStatus('Sending…', 'pending');
        const result = await submitContact(fields);

        if (result.ok) {
            setStatus('✓ Message sent — thank you for reaching out!', 'success'); // 6.4
            form.reset();
        } else {
            // 6.5 — failure message + direct email / mailto fallback
            showMailtoFallback(fields, 'network');
        }
    });

    function showMailtoFallback(fields, reason) {
        // Render the mailto as a real <a> so the user can click it (6.5).
        const link = mailtoFallback(fields);
        statusEl.textContent = '';
        statusEl.className = 'form-status form-status-error';
        statusEl.style.display = 'block';

        const prefix = reason === 'network'
            ? 'Could not deliver the message. Email me directly at '
            : 'Formspree is not yet configured. Email me directly at ';

        const msg = doc.createTextNode(prefix);
        const emailLink = doc.createElement('a');
        emailLink.href = `mailto:${CONFIG.contactEmail}`;
        emailLink.textContent = CONFIG.contactEmail;
        emailLink.style.color = 'var(--accent-cyan)';

        const orPart = doc.createTextNode(' or ');

        const mailtoLink = doc.createElement('a');
        mailtoLink.href = link;
        mailtoLink.textContent = 'open a pre-filled email';
        mailtoLink.style.color = 'var(--accent-cyan)';

        const suffix = doc.createTextNode('.');

        statusEl.appendChild(msg);
        statusEl.appendChild(emailLink);
        statusEl.appendChild(orPart);
        statusEl.appendChild(mailtoLink);
        statusEl.appendChild(suffix);
    }

    // Clear a field's error as the visitor corrects it.
    [nameEl, emailEl, messageEl].forEach((el) => {
        el.addEventListener('input', () => {
            const id = `${el.id}-error`;
            const errEl = doc.getElementById(id);
            if (errEl) {
                errEl.textContent = '';
                errEl.style.display = 'none';
            }
            el.setAttribute('aria-invalid', 'false');
        });
    });
}

// ---------------------------------------------------------------------------
// Résumé path resolution (Requirement 7.4)
// ---------------------------------------------------------------------------

/**
 * Resolve the résumé download href. If the normalized primary path does not
 * resolve, fall back to the actual PDF present in RES/. Returns the href that
 * should be applied to the download control.
 *
 * @param {{ primary: string, fallback: string, head: Function }} deps
 * @returns {Promise<{ href: string, live: boolean }>}
 */
export async function resolveResumeHref(deps) {
    const { primary, fallback, head } = deps;
    try {
        const res = await head(primary);
        if (res && res.ok) {
            return { href: primary, live: true };
        }
    } catch (_err) {
        /* fall through to fallback */
    }
    return { href: fallback, live: false };
}

export function initResumeLink() {
    const link = globalThis.document.getElementById('resumeLink');
    if (!link) return;
    const primary = CONFIG.resumePath; // RES/resume.pdf
    const fallback = 'RES/Rituraj_devops (8).pdf';

    // Apply the primary immediately; if it 404s, rewrite defensively (7.4).
    link.setAttribute('href', primary);
    if (typeof globalThis.fetch === 'function') {
        resolveResumeHref({
            primary,
            fallback,
            head: (url) => fetch(url, { method: 'HEAD' })
        }).then(({ href }) => link.setAttribute('href', href));
    }
}

export default initContactForm;
