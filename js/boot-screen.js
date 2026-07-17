// ===========================
// ⏳ Boot_Screen — Terminal Loading Screen (Requirement 3)
//
//   3.1 show the terminal-styled boot sequence while loading
//   3.2 on completion, hide and reveal main content
//   3.3 if not complete within 8s, hide and reveal anyway (hard timeout)
//   3.4 under prefers-reduced-motion, reveal within 1s with no animation
//
// hideBootScreen() is idempotent: whichever trigger fires first (normal
// completion, the 8s hard timeout, or the reduced-motion path) hides the
// screen exactly once and re-enables scrolling.
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

const DEFAULT_MAX_DURATION_MS = 8000;
const REDUCED_MOTION_REVEAL_MS = 700; // well within the 1s budget (3.4)

/**
 * @param {{ maxDurationMs?: number, reducedMotion?: boolean }} [opts]
 */
export function initBootScreen(opts = {}) {
    const {
        maxDurationMs = DEFAULT_MAX_DURATION_MS,
        reducedMotion = prefersReducedMotion()
    } = opts;

    const loadingScreen = globalThis.document.querySelector('.loading-screen');
    const terminalLines = globalThis.document.querySelectorAll('.loading-line');
    const progressBar = globalThis.document.getElementById('terminalProgress');
    const progressText = globalThis.document.getElementById('progressText');
    const cursor = globalThis.document.querySelector('.terminal-cursor');

    // Lock scroll while the boot screen is up (3.1).
    globalThis.document.body.style.overflow = 'hidden';

    // Idempotent hide — the single guarded exit for every trigger (3.2/3.3/3.4).
    let hidden = false;
    function hideBootScreen() {
        if (hidden) return;
        hidden = true;
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.display = 'none';
        }
        globalThis.document.body.style.overflow = 'auto'; // re-enable scrolling
    }

    // Hard timeout: guarantees reveal even if the animated sequence stalls (3.3).
    setTimeout(hideBootScreen, maxDurationMs);

    // Reduced-motion fast path: reveal quickly with no animated progression (3.4).
    if (reducedMotion) {
        terminalLines.forEach((line) => line.classList.add('visible'));
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = '100%';
        setTimeout(hideBootScreen, REDUCED_MOTION_REVEAL_MS);
        return;
    }

    // --- Animated path (3.1 -> 3.2) ---
    const firstLine = globalThis.document.querySelector('.terminal-line:first-child');
    if (firstLine) firstLine.classList.add('visible');

    let progressBarStarted = false;

    terminalLines.forEach((line) => {
        const delay = parseInt(line.dataset.delay, 10) || 0;
        setTimeout(() => {
            line.classList.add('visible');
            if (!progressBarStarted && line.querySelector('.progress-bar-container')) {
                progressBarStarted = true;
                animateProgressBar();
            }
        }, delay);
    });

    function animateProgressBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    if (cursor) cursor.classList.add('visible');
                    setTimeout(hideBootScreen, 800); // completion reveal (3.2)
                }, 200);
            }
            if (progressBar) progressBar.style.width = progress + '%';
            if (progressText) progressText.textContent = Math.floor(progress) + '%';
        }, 100);
    }
}

export default initBootScreen;
