/**
 * Theme Loader - Loads themes from JSON files
 * @module theme/themes
 *
 * Themes are stored as JSON files in /themes/ directory.
 * Users can add custom themes by creating new JSON files.
 */

import { TYPOGRAPHY, ELEVATION, SHAPE, MOTION, SPACING } from './tokens.js';

// Default theme IDs to load
const DEFAULT_THEMES = [
    'material-dark',
    'material-light',
    'ocean',
    'forest',
    'sunset',
    'cyber',
    'rose',
    'midnight',
    'mono',
    'amber'
];

// Cache for loaded themes
let THEMES = {};
let themesLoaded = false;
let loadPromise = null;

/**
 * Load a single theme from JSON file
 * @param {string} themeId - Theme ID (filename without .json)
 * @returns {Promise<Object|null>} Theme object or null if failed
 */
async function loadThemeFile(themeId) {
    try {
        const response = await fetch(`/themes/${themeId}.json`);
        if (!response.ok) {
            console.warn(`Theme "${themeId}" not found`);
            return null;
        }
        const theme = await response.json();

        // Add design tokens to theme
        theme.elevation = ELEVATION;
        theme.shape = SHAPE;
        theme.motion = MOTION;
        theme.spacing = SPACING;

        // Use default fonts if not specified
        if (!theme.fonts) {
            theme.fonts = {
                brand: TYPOGRAPHY.fontFamily.brand,
                plain: TYPOGRAPHY.fontFamily.plain,
                code: TYPOGRAPHY.fontFamily.code
            };
        }

        return theme;
    } catch (error) {
        console.error(`Failed to load theme "${themeId}":`, error);
        return null;
    }
}

/**
 * Load all default themes
 * @returns {Promise<Object>} All loaded themes
 */
async function loadAllThemes() {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        const results = await Promise.all(
            DEFAULT_THEMES.map(id => loadThemeFile(id))
        );

        results.forEach((theme) => {
            if (theme) {
                THEMES[theme.id] = theme;
            }
        });

        themesLoaded = true;
        console.log(`Loaded ${Object.keys(THEMES).length} themes`);
        return THEMES;
    })();

    return loadPromise;
}

/**
 * Get all available themes (loads if needed)
 * @returns {Promise<Object>} All theme definitions
 */
async function getAllThemes() {
    if (!themesLoaded) {
        await loadAllThemes();
    }
    return THEMES;
}

/**
 * Get all themes synchronously (returns empty if not loaded)
 * @returns {Object} All loaded themes
 */
function getAllThemesSync() {
    return THEMES;
}

/**
 * Get a specific theme by ID
 * @param {string} id - Theme ID
 * @returns {Object|null} Theme object or null
 */
function getTheme(id) {
    return THEMES[id] || null;
}

/**
 * Get a theme, loading it if necessary
 * @param {string} id - Theme ID
 * @returns {Promise<Object|null>} Theme object or null
 */
async function getThemeAsync(id) {
    if (!themesLoaded) {
        await loadAllThemes();
    }
    return THEMES[id] || null;
}

/**
 * Get theme metadata for theme picker
 * @returns {Array} Array of theme metadata
 */
function getThemeList() {
    return Object.values(THEMES).map(theme => ({
        id: theme.id,
        name: theme.name,
        icon: theme.icon,
        description: theme.description,
        isDark: theme.isDark,
        preview: [
            theme.colors.primary,
            theme.colors.secondary,
            theme.colors.surface
        ]
    }));
}

/**
 * Get theme list asynchronously (loads if needed)
 * @returns {Promise<Array>} Array of theme metadata
 */
async function getThemeListAsync() {
    if (!themesLoaded) {
        await loadAllThemes();
    }
    return getThemeList();
}

/**
 * Add a custom theme at runtime
 * @param {Object} theme - Theme object
 * @returns {boolean} Success status
 */
function addCustomTheme(theme) {
    if (!theme.id || !theme.name || !theme.colors) {
        console.error('Invalid theme: missing required fields (id, name, colors)');
        return false;
    }

    // Add design tokens
    theme.elevation = theme.elevation || ELEVATION;
    theme.shape = theme.shape || SHAPE;
    theme.motion = theme.motion || MOTION;
    theme.spacing = theme.spacing || SPACING;
    theme.fonts = theme.fonts || {
        brand: TYPOGRAPHY.fontFamily.brand,
        plain: TYPOGRAPHY.fontFamily.plain,
        code: TYPOGRAPHY.fontFamily.code
    };

    THEMES[theme.id] = theme;
    return true;
}

/**
 * Check if themes are loaded
 * @returns {boolean} True if themes are loaded
 */
function isLoaded() {
    return themesLoaded;
}

/**
 * Initialize themes (call this early in app startup)
 * @returns {Promise<void>}
 */
async function init() {
    await loadAllThemes();
}

export {
    init,
    loadAllThemes,
    getAllThemes,
    getAllThemesSync,
    getTheme,
    getThemeAsync,
    getThemeList,
    getThemeListAsync,
    addCustomTheme,
    isLoaded,
    THEMES
};
