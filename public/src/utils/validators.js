/**
 * Validators - Input validation and sanitization utilities
 * @module utils/validators
 */

/**
 * YouTube video ID regex pattern
 * Valid IDs are exactly 11 characters: alphanumeric, underscore, hyphen
 */
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * YouTube URL patterns
 */
const YOUTUBE_URL_PATTERNS = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
];

/**
 * YouTube channel ID pattern
 */
const CHANNEL_ID_REGEX = /^UC[a-zA-Z0-9_-]{22}$/;

/**
 * Validate a YouTube video ID
 * @param {string} id - Video ID to validate
 * @returns {boolean} True if valid
 */
function isValidVideoId(id) {
    if (!id || typeof id !== 'string') return false;
    return YOUTUBE_ID_REGEX.test(id);
}

/**
 * Extract video ID from a YouTube URL or ID
 * @param {string} input - URL or video ID
 * @returns {string|null} Video ID or null if invalid
 */
function extractVideoId(input) {
    if (!input || typeof input !== 'string') return null;

    const trimmed = input.trim();

    // Check if it's already a valid ID
    if (isValidVideoId(trimmed)) {
        return trimmed;
    }

    // Try to extract from URL
    for (const pattern of YOUTUBE_URL_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate a YouTube channel ID
 * @param {string} id - Channel ID to validate
 * @returns {boolean} True if valid
 */
function isValidChannelId(id) {
    if (!id || typeof id !== 'string') return false;
    return CHANNEL_ID_REGEX.test(id);
}

/**
 * Sanitize a string for safe HTML display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    if (!str || typeof str !== 'string') return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Sanitize a string for use in HTML attributes
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeAttribute(str) {
    if (!str || typeof str !== 'string') return '';

    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Validate a category name
 * @param {string} name - Category name
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateCategoryName(name) {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: 'Category name is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Category name cannot be empty' };
    }

    if (trimmed.length > 50) {
        return { valid: false, error: 'Category name too long (max 50 characters)' };
    }

    // Check for problematic characters
    if (/[<>"'`]/.test(trimmed)) {
        return { valid: false, error: 'Category name contains invalid characters' };
    }

    return { valid: true };
}

/**
 * Validate a video title
 * @param {string} title - Video title
 * @returns {Object} { valid: boolean, sanitized?: string, error?: string }
 */
function validateVideoTitle(title) {
    if (!title || typeof title !== 'string') {
        return { valid: false, error: 'Title is required' };
    }

    const trimmed = title.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Title cannot be empty' };
    }

    if (trimmed.length > 200) {
        return { valid: false, error: 'Title too long' };
    }

    return {
        valid: true,
        sanitized: sanitizeHTML(trimmed)
    };
}

/**
 * Validate imported data structure
 * @param {Object} data - Imported data object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateImportData(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Invalid data format'] };
    }

    // Check videos array
    if (data.videos !== undefined) {
        if (!Array.isArray(data.videos)) {
            errors.push('Videos must be an array');
        } else {
            data.videos.forEach((video, index) => {
                if (!video.id) {
                    errors.push(`Video at index ${index} missing ID`);
                } else if (!isValidVideoId(video.id)) {
                    errors.push(`Video at index ${index} has invalid ID`);
                }
                if (!video.title) {
                    errors.push(`Video at index ${index} missing title`);
                }
            });
        }
    }

    // Check categories array
    if (data.categories !== undefined) {
        if (!Array.isArray(data.categories)) {
            errors.push('Categories must be an array');
        } else {
            data.categories.forEach((cat, index) => {
                if (typeof cat !== 'string') {
                    errors.push(`Category at index ${index} must be a string`);
                }
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate a hex color
 * @param {string} color - Hex color string
 * @returns {boolean} True if valid
 */
function isValidHexColor(color) {
    if (!color || typeof color !== 'string') return false;
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate a CSS color (hex, rgb, rgba, hsl, hsla, named)
 * @param {string} color - CSS color string
 * @returns {boolean} True if valid
 */
function isValidCSSColor(color) {
    if (!color || typeof color !== 'string') return false;

    // Create a test element
    const el = document.createElement('div');
    el.style.color = color;
    return el.style.color !== '';
}

export {
    isValidVideoId,
    extractVideoId,
    isValidChannelId,
    sanitizeHTML,
    sanitizeAttribute,
    validateCategoryName,
    validateVideoTitle,
    validateImportData,
    isValidHexColor,
    isValidCSSColor
};
