// ===========================
// 🌗 Theme_Controller — Dark/Light Mode Toggle + persistence
//
// Requirements 8.1–8.4:
//   8.1 toggle flips dark <-> light
//   8.2 persist selection to localStorage["theme"]
//   8.3 apply persisted theme on load
//   8.4 default to dark when nothing is persisted
//
// The pure helpers (resolveInitialTheme / nextTheme) contain no DOM access so
// they can be unit-tested directly in Node (see tests/theme.test.mjs). The
// inline FOUC guard in index.html <head> applies data-theme before first paint;
// this module then wires the toggle and syncs the icon.
// ===========================

export const THEME_STORAGE_KEY = 'theme';
export const DEFAULT_THEME = 'dark';

/**
 * PURE: resolve the theme to apply on load from a persisted value.
 * Returns the persisted theme when it is a recognised value, otherwise the
 * default ("dark"). (Requirements 8.3, 8.4)
 * @param {unknown} stored
 * @returns {"dark"|"light"}
 */
export function resolveInitialTheme(stored) {
    return stored === 'dark' || stored === 'light' ? stored : DEFAULT_THEME;
}

/**
 * PURE: the theme that a toggle should switch to from the active one.
 * (Requirement 8.1)
 * @param {unknown} active
 * @returns {"dark"|"light"}
 */
export function nextTheme(active) {
    return active === 'dark' ? 'light' : 'dark';
}

export function initTheme() {
    const themeToggle = globalThis.document.querySelector('.theme-toggle');
    const htmlElement = globalThis.document.documentElement;

    // Function to update navbar colors based on theme
    function updateNavbarColors(theme) {
        const navbar = globalThis.document.querySelector('.navbar');
        if (!navbar) return;
        const isScrolled = window.scrollY > 100;

        if (theme === 'light') {
            navbar.style.background = isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = isScrolled ? '0 4px 16px rgba(0, 0, 0, 0.1)' : 'none';
        } else {
            navbar.style.background = isScrolled ? 'rgba(10, 14, 26, 0.98)' : 'rgba(10, 14, 26, 0.95)';
            navbar.style.boxShadow = isScrolled ? '0 4px 16px rgba(0, 217, 255, 0.1)' : 'none';
        }
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        // Show the icon for the theme you can switch TO.
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Apply persisted theme (or default). The inline <head> guard may already
    // have set data-theme; re-resolving here keeps this module authoritative and
    // testable in isolation. (Requirements 8.3, 8.4)
    const currentTheme = resolveInitialTheme(safeGet(THEME_STORAGE_KEY));
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    updateNavbarColors(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = htmlElement.getAttribute('data-theme');
            const applied = nextTheme(activeTheme);

            htmlElement.setAttribute('data-theme', applied);   // 8.1
            safeSet(THEME_STORAGE_KEY, applied);                // 8.2
            updateThemeIcon(applied);
            updateNavbarColors(applied);

            // Add rotation animation (skipped implicitly for reduced motion via CSS)
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }
}

// localStorage can throw in privacy modes; never let that break theming.
function safeGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (_e) {
        return null;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (_e) {
        /* ignore */
    }
}

export default initTheme;
