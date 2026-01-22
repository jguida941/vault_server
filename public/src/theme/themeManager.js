/**
 * Theme Manager - Apply and manage themes
 * @module theme/themeManager
 */

import { init as initThemes, getTheme, getThemeList, getAllThemesSync } from './themes.js';
import { TYPOGRAPHY, ELEVATION, SHAPE, MOTION, SPACING } from './tokens.js';
import * as Storage from '../core/storage.js';

let currentThemeId = 'material-dark';
const listeners = new Set();

/**
 * Subscribe to theme changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

/**
 * Notify listeners of theme change
 * @param {Object} theme - New theme
 */
function notify(theme) {
    listeners.forEach(callback => {
        try {
            callback(theme);
        } catch (e) {
            console.error('ThemeManager: Listener error:', e);
        }
    });
}

/**
 * Apply a theme to the document
 * @param {string} themeId - Theme ID
 * @returns {boolean} Success status
 */
function applyTheme(themeId) {
    const theme = getTheme(themeId);
    if (!theme) {
        console.error(`ThemeManager: Theme "${themeId}" not found`);
        return false;
    }

    const root = document.documentElement;

    // Apply color tokens
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--md-sys-color-${kebabCase(key)}`, value);
    });

    // Apply legacy variable mappings for backwards compatibility
    applyLegacyVariables(root, theme);

    // Apply typography tokens
    root.style.setProperty('--md-sys-typescale-brand', theme.fonts.brand);
    root.style.setProperty('--md-sys-typescale-plain', theme.fonts.plain);
    root.style.setProperty('--md-sys-typescale-code', theme.fonts.code);

    // Apply elevation tokens
    Object.entries(ELEVATION).forEach(([key, value]) => {
        root.style.setProperty(`--md-sys-elevation-${key}`, value);
    });

    // Apply shape tokens
    Object.entries(SHAPE).forEach(([key, value]) => {
        root.style.setProperty(`--md-sys-shape-${kebabCase(key)}`, value);
    });

    // Apply motion tokens
    Object.entries(MOTION).forEach(([key, value]) => {
        root.style.setProperty(`--md-sys-motion-${kebabCase(key)}`, value);
    });

    // Apply spacing tokens
    Object.entries(SPACING).forEach(([key, value]) => {
        root.style.setProperty(`--md-sys-spacing-${key}`, value);
    });

    // Set theme attribute
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-theme-mode', theme.isDark ? 'dark' : 'light');

    // Update current theme
    currentThemeId = themeId;

    // Persist selection
    Storage.setSetting(Storage.STORAGE_KEYS.THEME, themeId);

    // Notify listeners
    notify(theme);

    return true;
}

/**
 * Apply legacy CSS variable mappings for backwards compatibility
 * @param {HTMLElement} root - Root element
 * @param {Object} theme - Theme object
 */
function applyLegacyVariables(root, theme) {
    const colors = theme.colors;

    // Map to legacy variable names
    const legacyMap = {
        '--bg-primary': colors.surface,
        '--bg-secondary': colors.surfaceContainer,
        '--bg-tertiary': colors.surfaceContainerHigh,
        '--text-primary': colors.onSurface,
        '--text-secondary': colors.onSurfaceVariant,
        '--text-tertiary': colors.outline,
        '--accent-primary': colors.primary,
        '--accent-secondary': colors.secondary,
        '--accent-tertiary': colors.tertiary,
        '--border-primary': colors.outline,
        '--border-secondary': colors.outlineVariant,
        '--shadow-primary': `${colors.primary}40`,
        '--shadow-secondary': `${colors.secondary}30`,
        '--overlay': `${colors.scrim || '#000000'}CC`,
        '--button-bg': colors.primary,
        '--button-text': colors.onPrimary,
        '--button-hover-bg': colors.primaryContainer,
        '--button-border': `1px solid ${colors.outline}`,
        '--button-shadow': ELEVATION.level2,
        '--font-primary': theme.fonts.brand,
        '--font-secondary': theme.fonts.plain,
        '--border-radius': SHAPE.cornerMedium,
        '--transition-speed': MOTION.durationMedium2
    };

    Object.entries(legacyMap).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

/**
 * Convert camelCase to kebab-case
 * @param {string} str - String to convert
 * @returns {string} Kebab-case string
 */
function kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Get current theme ID
 * @returns {string} Current theme ID
 */
function getCurrentThemeId() {
    return currentThemeId;
}

/**
 * Get current theme object
 * @returns {Object} Current theme
 */
function getCurrentTheme() {
    return getTheme(currentThemeId);
}

/**
 * Initialize theme manager - loads themes and applies saved or default theme
 * @returns {Promise<void>}
 */
async function init() {
    // Load all themes from JSON files
    await initThemes();

    // Try to load saved theme
    const savedTheme = Storage.getSetting(Storage.STORAGE_KEYS.THEME, null);
    const themes = getAllThemesSync();

    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
        return;
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'material-dark' : 'material-light');

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if no saved preference
        if (!Storage.getSetting(Storage.STORAGE_KEYS.THEME, null)) {
            applyTheme(e.matches ? 'material-dark' : 'material-light');
        }
    });
}

/**
 * Toggle between light and dark variants of current theme
 */
function toggleDarkMode() {
    const current = getCurrentTheme();
    if (!current) return;

    const themes = getAllThemesSync();

    // Try to find opposite variant
    const targetMode = current.isDark ? 'light' : 'dark';
    const baseName = currentThemeId.replace(/-dark$/, '').replace(/-light$/, '');

    // Look for explicit variant
    const variantId = `${baseName}-${targetMode}`;
    if (themes[variantId]) {
        applyTheme(variantId);
        return;
    }

    // Fall back to material variants
    applyTheme(current.isDark ? 'material-light' : 'material-dark');
}

/**
 * Generate CSS string for a theme
 * @param {string} themeId - Theme ID
 * @returns {string} CSS string
 */
function generateThemeCSS(themeId) {
    const theme = getTheme(themeId);
    if (!theme) return '';

    let css = `:root[data-theme="${themeId}"] {\n`;

    // Color tokens
    Object.entries(theme.colors).forEach(([key, value]) => {
        css += `  --md-sys-color-${kebabCase(key)}: ${value};\n`;
    });

    // Typography
    css += `  --md-sys-typescale-brand: ${theme.fonts.brand};\n`;
    css += `  --md-sys-typescale-plain: ${theme.fonts.plain};\n`;
    css += `  --md-sys-typescale-code: ${theme.fonts.code};\n`;

    css += '}\n';

    return css;
}

export {
    applyTheme,
    getCurrentThemeId,
    getCurrentTheme,
    init,
    toggleDarkMode,
    subscribe,
    getThemeList,
    generateThemeCSS
};
