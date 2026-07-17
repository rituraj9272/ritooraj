// ===========================
// Motion_System — scroll entrance animations, counters, micro-interactions.
// IntersectionObserver-based reveals + reduced-motion gating (Requirement 13).
//
// Under prefers-reduced-motion: every element renders in its final visible
// state immediately; no entrance, counter, or JS-driven animation runs (13.3).
// Micro-interactions (hover/focus) still fire but via CSS non-motion cues.
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

export function initMotion() {
    try {
        const reduced = prefersReducedMotion();

        // Reveal an element to its final visible state (no transform/opacity
        // animation). Used directly under reduced motion and on intersection
        // otherwise.
        const reveal = (el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        };

        // Observe a set of elements and reveal them when they enter the viewport.
        // Under reduced motion we reveal everything immediately (final state).
        const revealOnView = (selector, baseTransform, transition) => {
            const els = globalThis.document.querySelectorAll(selector);
            if (!els.length) return;
            if (reduced) {
                els.forEach(reveal);
                return;
            }
            const obs = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (transition) entry.target.style.transition = transition;
                        reveal(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

            els.forEach((el) => {
                el.style.opacity = '0';
                el.style.transform = baseTransform;
                obs.observe(el);
            });
        };

        // Sections / cards (Requirement 13.1, 13.4)
        revealOnView(
            '.section, .project-card, .skill-category, .timeline-item, .case-study-card',
            'translateY(30px)',
            'opacity 0.6s ease, transform 0.6s ease'
        );


    // Skill Tags Hover Effect (micro-interaction; non-motion cue, safe under RM)
    globalThis.document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.background = 'rgba(0, 217, 255, 0.1)';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.background = '';
        });
    });

    // Infrastructure Layers reveal (Requirement 13.1)
    revealOnView('.infra-layer', 'translateX(-30px)', 'opacity 0.6s ease, transform 0.6s ease');

    // Terminal Command reveal
    revealOnView('.terminal-line', 'translateX(-20px)', 'opacity 0.4s ease, transform 0.4s ease');

    // Project Cards Stagger reveal
    revealOnView('.project-card', 'translateY(30px)', 'opacity 0.6s ease, transform 0.6s ease');

    // Timeline Markers reveal (final transform keeps the -50% X centering)
    revealOnView('.timeline-marker', 'translateX(-50%) scale(0)', 'transform 0.5s ease, opacity 0.5s ease');

    // Stats Counter Animation (gated under reduced motion: skip, show final)
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    const statsGrid = globalThis.document.querySelector('.stats-grid');
    if (statsGrid && !reduced) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-card h4').forEach(card => {
                        const value = parseInt(card.textContent, 10);
                        if (!isNaN(value)) animateCounter(card, value);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        statsObserver.observe(statsGrid);
    }

    // Scroll Progress Indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || globalThis.document.documentElement.scrollTop;
        const scrollHeight = globalThis.document.documentElement.scrollHeight - globalThis.document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        let progressBar = globalThis.document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = globalThis.document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            globalThis.document.body.appendChild(progressBar);
        }

        progressBar.style.width = `${scrollPercentage}%`;
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Lazy Load Images (native loading="lazy" is the primary path in HTML)
    const images = globalThis.document.querySelectorAll('img[data-src]');
    if (images.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    // Achievement Cards Pulse Animation (micro-interaction; skipped under RM)
    if (!reduced) {
        const achievementCards = globalThis.document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                const icon = this.querySelector('.achievement-icon');
                if (!icon) return;
                icon.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 500);
            });
        });

        const style = globalThis.document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        globalThis.document.head.appendChild(style);
    }

    // Skill Progress Bar Animation (gated under reduced motion: set final width)
    const skillProgressBars = globalThis.document.querySelectorAll('.skill-progress-fill');
    if (skillProgressBars.length) {
        if (reduced) {
            skillProgressBars.forEach(bar => {
                bar.style.width = `${bar.getAttribute('data-progress') || 0}%`;
            });
        } else {
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const target = bar.getAttribute('data-progress');
                        setTimeout(() => { bar.style.width = `${target}%`; }, 100);
                        skillObserver.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            skillProgressBars.forEach(bar => skillObserver.observe(bar));
        }
    }
    } catch (_err) {
        // A failing enhancement must never block core content (Requirement 10.2).
    }
}

export default initMotion;
