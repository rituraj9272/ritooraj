// ===========================
// App entry point — imports feature modules and initializes them
// in a safe order after the DOM is ready (Requirement 1.1, 1.4, 16.1, 18.1).
//
// Init order (design.md -> main.js): theme -> boot -> navigation -> terminal
// -> github -> contact -> architecture -> motion -> canvas -> cursor.
// Each init is guarded so one failing enhancement never blocks the rest
// (Requirement 10.2). Reduced-motion state is sourced from the shared helper
// and passed to consumers that branch on it.
// ===========================

import { initTheme } from './theme-controller.js';
import { initBootScreen } from './boot-screen.js';
import { initNavigation } from './navigation.js';
import { initTerminal } from './terminal.js';
import { initGitHub } from './github-service.js';
import { initContactForm, initResumeLink } from './contact-form.js';
import { initArchitecture } from './architecture.js';
import { initMotion } from './motion-system.js';
import { initBackgroundCanvas } from './background-canvas.js';
import { initCursor } from './cursor.js';
import { prefersReducedMotion } from './reduced-motion.js';

// Run an init fn, swallowing errors so the app still comes up (10.2).
function safe(fn, label) {
    try {
        fn();
    } catch (err) {
        console.warn(`[init] ${label} failed:`, err);
    }
}

function boot() {
    const reducedMotion = prefersReducedMotion();

    // Safe init order.
    safe(initTheme, 'theme');
    safe(() => initBootScreen({ reducedMotion }), 'boot');
    safe(initNavigation, 'navigation');
    safe(initTerminal, 'terminal');
    safe(initGitHub, 'github');
    safe(initContactForm, 'contact-form');
    safe(initResumeLink, 'resume-link');
    safe(initArchitecture, 'architecture');
    safe(initMotion, 'motion');
    safe(initBackgroundCanvas, 'background-canvas');
    safe(initCursor, 'cursor');

    // Misc app-level behaviours (kept, guarded).
    safe(initProjectFilters, 'project-filters');
    safe(updateFooterYear, 'footer-year');
    safe(logConsoleEasterEgg, 'console-easter-egg');
    safe(monitorPerformance, 'performance');
}

// 🎯 Project Filtering System
function initProjectFilters() {
    const filterButtons = globalThis.document.querySelectorAll('.filter-btn');
    const allProjectCards = globalThis.document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            allProjectCards.forEach(card => {
                const categories = card.getAttribute('data-category').toLowerCase();

                if (filterValue === 'all' || categories.includes(filterValue.toLowerCase())) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Dynamic Year in Footer
function updateFooterYear() {
    const yearElements = globalThis.document.querySelectorAll('.footer-content p');
    yearElements.forEach(el => {
        if (el.textContent.includes('2026')) {
            el.textContent = el.textContent.replace('2026', String(new Date().getFullYear()));
        }
    });
}

// Console Easter Egg
function logConsoleEasterEgg() {
    console.log('%cHey there, DevOps engineer! 👋', 'color: #00D9FF; font-size: 20px; font-weight: bold;');
    console.log('%cLooking at the console? I like your curiosity! 🚀', 'color: #7B2FF7; font-size: 14px;');
    console.log('%c$ whoami\nRituraj Singh - DevOps Engineer', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
    console.log('%c$ current_mission\nAutomating everything that moves and building scalable infrastructure 💻', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
    console.log('%c$ contact\nEmail: singh.ritooraj@gmail.com\nGitHub: github.com/ritooraj01', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
    console.log('%cLet\'s connect and build something amazing together! 🎯', 'color: #FF006E; font-size: 14px;');
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (!perfData) return;
            console.log(`%cPage Load Performance:`, 'color: #FFD60A; font-weight: bold;');
            console.log(`⚡ DOM Content Loaded: ${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`);
            console.log(`🚀 Total Load Time: ${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`);
        });
    }
}

if (globalThis.document.readyState === 'loading') {
    globalThis.document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
