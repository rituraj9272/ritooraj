// ===========================
// 🖱️ Custom Cursor Effects (desktop only, feature-detected).
// Graceful degradation (Requirement 10.2): on touch / unsupported / reduced
// motion, the native cursor is kept and no rAF loop runs. A failure here never
// blocks content or navigation.
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

export function initCursor() {
    try {
        const cursor = globalThis.document.querySelector('.cursor');
        const cursorFollower = globalThis.document.querySelector('.cursor-follower');
        if (!cursor || !cursorFollower) return;

        // Never replace the native cursor on touch / unsupported devices (10.2).
        const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        const isDesktop = window.innerWidth > 768;
        if (!isDesktop || isTouch) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
            return;
        }

        // Reduced motion: keep the cursor visible but skip the follow loop (13.3).
        if (prefersReducedMotion()) {
            cursor.style.transform = 'translate(-50%, -50%)';
            cursorFollower.style.transform = 'translate(-50%, -50%)';
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        globalThis.document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Main cursor follows immediately
            cursorX += (mouseX - cursorX) * 0.9;
            cursorY += (mouseY - cursorY) * 0.9;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            // Follower has a delay
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }

        // Only run cursor effects on desktop
        if (isDesktop && !prefersReducedMotion()) {
            animateCursor();
        }

        // Add cursor interactions
        const interactiveElements = globalThis.document.querySelectorAll('a, button, .project-card, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    } catch (_err) {
        // Degrade silently: content remains visible and navigable (10.2).
    }
}

export default initCursor;
