// ===========================
// Shared reduced-motion helper.
// A single source of truth so every effect module (boot, motion, architecture,
// canvas, cursor) gates non-essential animation consistently (Requirement 13).
// ===========================

export function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

export default prefersReducedMotion;
