/**
 * Storage Module - LocalStorage wrapper with validation and error handling
 * @module core/storage
 */

const STORAGE_KEYS = {
    VIDEOS: 'vaultVideos',
    CATEGORIES: 'vaultCategories',
    THEME: 'selectedTheme',
    PRIVATE_MODE: 'privateMode',
    VIEW_MODE: 'viewMode',
    SHUFFLE_MODE: 'shuffleMode',
    REPEAT_MODE: 'repeatMode',
    AUTO_PLAY: 'autoPlayVideos',
    VISUALIZER: 'enableVisualizer',
    REDUCED_MOTION: 'reducedMotion'
};

const DEFAULT_CATEGORIES = ['Hip Hop', 'Rock', 'Electronic', 'Chill', 'Podcast'];

/**
 * Strip emojis from a string
 * @param {string} str - Input string
 * @returns {string} String without emojis
 */
function stripEmojis(str) {
    // Comprehensive emoji regex covering all common ranges
    return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]/gu, '').trim();
}

/**
 * Safe JSON parse with fallback
 * @param {string} json - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
function safeParse(json, fallback) {
    if (!json) return fallback;
    try {
        return JSON.parse(json);
    } catch (e) {
        console.error('Storage: Failed to parse JSON:', e);
        return fallback;
    }
}

/**
 * Get item from localStorage with type validation
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
function get(key, defaultValue = null) {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;

    // Handle boolean strings
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Try to parse as JSON
    return safeParse(value, value);
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function set(key, value) {
    try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
    } catch (e) {
        console.error('Storage: Failed to save:', e);
        if (e.name === 'QuotaExceededError') {
            console.warn('Storage quota exceeded - triggering compaction');
            compactStorage();
        }
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
function remove(key) {
    localStorage.removeItem(key);
}

/**
 * Get current storage size in bytes
 * @returns {number} Size in bytes
 */
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
        }
    }
    return total;
}

/**
 * Check if storage is near capacity (> 4.5MB of 5MB)
 * @returns {boolean} True if near capacity
 */
function isNearCapacity() {
    return getStorageSize() > 4.5 * 1024 * 1024;
}

/**
 * Compact storage by removing old data
 */
function compactStorage() {
    const videos = getVideos();
    if (videos.length > 100) {
        // Keep only the 100 most recent videos
        const sorted = [...videos].sort((a, b) => (b.addedDate || 0) - (a.addedDate || 0));
        setVideos(sorted.slice(0, 100));
        console.log('Storage: Compacted to 100 most recent videos');
    }
}

// ============= Video Storage =============

/**
 * Get all videos from storage
 * @returns {Array} Array of video objects
 */
function getVideos() {
    const videos = get(STORAGE_KEYS.VIDEOS, []);
    return Array.isArray(videos) ? videos : [];
}

/**
 * Save videos to storage
 * @param {Array} videos - Array of video objects
 */
function setVideos(videos) {
    set(STORAGE_KEYS.VIDEOS, videos);
}

/**
 * Add a video to storage
 * @param {Object} video - Video object
 * @returns {boolean} Success status
 */
function addVideo(video) {
    if (!video.id || !video.title) {
        console.error('Storage: Invalid video object');
        return false;
    }

    const videos = getVideos();

    // Check for duplicate
    if (videos.some(v => v.id === video.id)) {
        console.warn('Storage: Video already exists');
        return false;
    }

    videos.push({
        id: video.id,
        title: video.title,
        artist: video.artist || '',
        category: video.category || 'Uncategorized',
        isPrivate: video.isPrivate || false,
        addedDate: video.addedDate || Date.now()
    });

    setVideos(videos);
    return true;
}

/**
 * Remove a video from storage
 * @param {string} videoId - Video ID to remove
 * @returns {boolean} Success status
 */
function removeVideo(videoId) {
    const videos = getVideos();
    const filtered = videos.filter(v => v.id !== videoId);

    if (filtered.length === videos.length) {
        return false; // Video not found
    }

    setVideos(filtered);
    return true;
}

/**
 * Update a video in storage
 * @param {string} videoId - Video ID to update
 * @param {Object} updates - Properties to update
 * @returns {boolean} Success status
 */
function updateVideo(videoId, updates) {
    const videos = getVideos();
    const index = videos.findIndex(v => v.id === videoId);

    if (index === -1) return false;

    videos[index] = { ...videos[index], ...updates };
    setVideos(videos);
    return true;
}

// ============= Category Storage =============

/**
 * Normalize a category name for comparison
 * @param {string} name - Category name
 * @returns {string} Normalized name
 */
function normalizeCategory(name) {
    return name.toLowerCase().replace(/[-_\s]+/g, ' ').trim();
}

/**
 * Get all categories from storage
 * @returns {Array} Array of category names
 */
function getCategories() {
    const categories = get(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    if (!Array.isArray(categories)) return DEFAULT_CATEGORIES;

    // Clean up any categories with emojis
    const cleaned = categories.map(cat => stripEmojis(cat)).filter(cat => cat.length > 0);

    // Remove duplicates (case-insensitive, treating hyphens/spaces as same)
    const seen = new Map();
    const unique = [];
    for (const cat of cleaned) {
        const normalized = normalizeCategory(cat);
        if (!seen.has(normalized)) {
            seen.set(normalized, true);
            unique.push(cat);
        }
    }

    // If categories changed, save the cleaned version
    if (JSON.stringify(unique) !== JSON.stringify(categories)) {
        setCategories(unique);
    }

    return unique;
}

/**
 * Save categories to storage
 * @param {Array} categories - Array of category names
 */
function setCategories(categories) {
    set(STORAGE_KEYS.CATEGORIES, categories);
}

/**
 * Add a category
 * @param {string} name - Category name
 * @returns {boolean} Success status
 */
function addCategory(name) {
    if (!name || typeof name !== 'string') return false;

    // Clean and trim
    const cleaned = stripEmojis(name.trim());
    if (!cleaned) return false;

    const categories = getCategories();

    // Check for duplicates using normalized comparison
    const normalizedNew = normalizeCategory(cleaned);
    if (categories.some(c => normalizeCategory(c) === normalizedNew)) return false;

    categories.push(cleaned);
    setCategories(categories);
    return true;
}

/**
 * Remove a category
 * @param {string} name - Category name
 * @returns {boolean} Success status
 */
function removeCategory(name) {
    const categories = getCategories();
    const filtered = categories.filter(c => c !== name);

    if (filtered.length === categories.length) return false;

    setCategories(filtered);
    return true;
}

// ============= Settings Storage =============

/**
 * Get a setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value
 * @returns {*} Setting value
 */
function getSetting(key, defaultValue) {
    return get(key, defaultValue);
}

/**
 * Set a setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 */
function setSetting(key, value) {
    set(key, value);
}

// ============= Export/Import =============

/**
 * Export all vault data
 * @returns {Object} Export data object
 */
function exportData() {
    return {
        version: '2.0.0',
        exportDate: new Date().toISOString(),
        videos: getVideos(),
        categories: getCategories(),
        settings: {
            theme: get(STORAGE_KEYS.THEME),
            privateMode: get(STORAGE_KEYS.PRIVATE_MODE, false),
            viewMode: get(STORAGE_KEYS.VIEW_MODE, 'grid')
        }
    };
}

/**
 * Import vault data
 * @param {Object} data - Import data object
 * @returns {Object} Import result { success, imported, duplicates }
 */
function importData(data) {
    const result = { success: false, imported: 0, duplicates: 0 };

    if (!data || typeof data !== 'object') {
        return result;
    }

    // Import videos
    if (Array.isArray(data.videos)) {
        const existingVideos = getVideos();
        const existingIds = new Set(existingVideos.map(v => v.id));

        data.videos.forEach(video => {
            if (video.id && video.title) {
                if (existingIds.has(video.id)) {
                    result.duplicates++;
                } else {
                    existingVideos.push({
                        id: video.id,
                        title: video.title,
                        category: video.category || 'Imported',
                        isPrivate: video.isPrivate || false,
                        addedDate: video.addedDate || Date.now()
                    });
                    result.imported++;
                }
            }
        });

        setVideos(existingVideos);
    }

    // Import categories
    if (Array.isArray(data.categories)) {
        const existingCategories = getCategories();
        data.categories.forEach(cat => {
            if (cat && !existingCategories.includes(cat)) {
                existingCategories.push(cat);
            }
        });
        setCategories(existingCategories);
    }

    result.success = true;
    return result;
}

/**
 * Clear all vault data
 */
function clearAll() {
    remove(STORAGE_KEYS.VIDEOS);
    setCategories(DEFAULT_CATEGORIES);
}

// Export module
export {
    STORAGE_KEYS,
    DEFAULT_CATEGORIES,
    get,
    set,
    remove,
    getStorageSize,
    isNearCapacity,
    compactStorage,
    getVideos,
    setVideos,
    addVideo,
    removeVideo,
    updateVideo,
    getCategories,
    setCategories,
    addCategory,
    removeCategory,
    getSetting,
    setSetting,
    exportData,
    importData,
    clearAll
};
