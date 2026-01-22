/**
 * State Manager - Centralized reactive state management
 * @module core/state
 */

import * as Storage from './storage.js';

/**
 * Application state
 */
const state = {
    // Data
    videos: [],
    categories: [],

    // UI State
    currentMode: 'launcher', // launcher, music, podcast, radio, settings
    currentCategory: 'all',
    currentlyPlaying: null,

    // Settings
    privateMode: false,
    viewMode: 'grid',
    shuffleMode: false,
    repeatMode: false,

    // Theme
    currentTheme: 'material-dark',

    // Player
    isPlaying: false,
    currentIndex: 0,
    playlist: []
};

/**
 * State change listeners
 */
const listeners = new Map();

/**
 * Subscribe to state changes
 * @param {string} key - State key to watch
 * @param {Function} callback - Callback function (newValue, oldValue)
 * @returns {Function} Unsubscribe function
 */
function subscribe(key, callback) {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);

    return () => listeners.get(key).delete(callback);
}

/**
 * Notify listeners of state change
 * @param {string} key - State key that changed
 * @param {*} newValue - New value
 * @param {*} oldValue - Old value
 */
function notify(key, newValue, oldValue) {
    if (listeners.has(key)) {
        listeners.get(key).forEach(callback => {
            try {
                callback(newValue, oldValue);
            } catch (e) {
                console.error('State: Listener error:', e);
            }
        });
    }
}

/**
 * Get state value
 * @param {string} key - State key
 * @returns {*} State value
 */
function get(key) {
    return state[key];
}

/**
 * Set state value and notify listeners
 * @param {string} key - State key
 * @param {*} value - New value
 * @param {boolean} persist - Whether to persist to storage
 */
function set(key, value, persist = false) {
    const oldValue = state[key];

    if (oldValue === value) return;

    state[key] = value;
    notify(key, value, oldValue);

    if (persist) {
        persistState(key, value);
    }
}

/**
 * Persist state to storage
 * @param {string} key - State key
 * @param {*} value - Value to persist
 */
function persistState(key, value) {
    const keyMap = {
        videos: Storage.STORAGE_KEYS.VIDEOS,
        categories: Storage.STORAGE_KEYS.CATEGORIES,
        currentTheme: Storage.STORAGE_KEYS.THEME,
        privateMode: Storage.STORAGE_KEYS.PRIVATE_MODE,
        viewMode: Storage.STORAGE_KEYS.VIEW_MODE,
        shuffleMode: Storage.STORAGE_KEYS.SHUFFLE_MODE,
        repeatMode: Storage.STORAGE_KEYS.REPEAT_MODE
    };

    if (keyMap[key]) {
        Storage.set(keyMap[key], value);
    }
}

/**
 * Initialize state from storage
 */
function init() {
    state.videos = Storage.getVideos();
    state.categories = Storage.getCategories();
    state.privateMode = Storage.getSetting(Storage.STORAGE_KEYS.PRIVATE_MODE, false);
    state.viewMode = Storage.getSetting(Storage.STORAGE_KEYS.VIEW_MODE, 'grid');
    state.shuffleMode = Storage.getSetting(Storage.STORAGE_KEYS.SHUFFLE_MODE, false);
    state.repeatMode = Storage.getSetting(Storage.STORAGE_KEYS.REPEAT_MODE, false);
    state.currentTheme = Storage.getSetting(Storage.STORAGE_KEYS.THEME, 'material-dark');
}

// ============= Video Actions =============

/**
 * Add a video
 * @param {Object} video - Video object
 * @returns {boolean} Success status
 */
function addVideo(video) {
    const success = Storage.addVideo(video);
    if (success) {
        state.videos = Storage.getVideos();
        notify('videos', state.videos, null);
    }
    return success;
}

/**
 * Remove a video
 * @param {string} videoId - Video ID
 * @returns {boolean} Success status
 */
function removeVideo(videoId) {
    const success = Storage.removeVideo(videoId);
    if (success) {
        state.videos = Storage.getVideos();
        notify('videos', state.videos, null);
    }
    return success;
}

/**
 * Get filtered videos based on current state
 * @returns {Array} Filtered videos
 */
function getFilteredVideos() {
    let videos = state.videos;

    // Filter by private mode
    if (!state.privateMode) {
        videos = videos.filter(v => !v.isPrivate);
    }

    // Filter by category
    if (state.currentCategory !== 'all') {
        videos = videos.filter(v => {
            const normalizedVideo = v.category.toLowerCase().replace(/\s+/g, '-');
            const normalizedCurrent = state.currentCategory.toLowerCase().replace(/\s+/g, '-');
            return normalizedVideo === normalizedCurrent;
        });
    }

    return videos;
}

// ============= Category Actions =============

/**
 * Add a category
 * @param {string} name - Category name
 * @returns {boolean} Success status
 */
function addCategory(name) {
    const success = Storage.addCategory(name);
    if (success) {
        state.categories = Storage.getCategories();
        notify('categories', state.categories, null);
    }
    return success;
}

/**
 * Remove a category
 * @param {string} name - Category name
 * @returns {boolean} Success status
 */
function removeCategory(name) {
    const success = Storage.removeCategory(name);
    if (success) {
        state.categories = Storage.getCategories();
        notify('categories', state.categories, null);
    }
    return success;
}

// ============= Mode Actions =============

/**
 * Switch application mode
 * @param {string} mode - Mode name
 */
function switchMode(mode) {
    const validModes = ['launcher', 'music', 'podcast', 'radio', 'settings'];
    if (validModes.includes(mode)) {
        set('currentMode', mode);
    }
}

/**
 * Toggle private mode
 */
function togglePrivateMode() {
    set('privateMode', !state.privateMode, true);
}

/**
 * Set view mode
 * @param {string} mode - 'grid' or 'list'
 */
function setViewMode(mode) {
    if (mode === 'grid' || mode === 'list') {
        set('viewMode', mode, true);
    }
}

/**
 * Set category filter
 * @param {string} category - Category name or 'all'
 */
function setCategory(category) {
    set('currentCategory', category);
}

// ============= Player Actions =============

/**
 * Set currently playing video
 * @param {string} videoId - Video ID or null
 */
function setPlaying(videoId) {
    set('currentlyPlaying', videoId);
    set('isPlaying', videoId !== null);
}

/**
 * Toggle shuffle mode
 */
function toggleShuffle() {
    set('shuffleMode', !state.shuffleMode, true);
}

/**
 * Toggle repeat mode
 */
function toggleRepeat() {
    set('repeatMode', !state.repeatMode, true);
}

/**
 * Build playlist from current filter
 */
function buildPlaylist() {
    state.playlist = getFilteredVideos();
    state.currentIndex = 0;
    notify('playlist', state.playlist, null);
}

// Export module
export {
    state,
    subscribe,
    get,
    set,
    init,
    addVideo,
    removeVideo,
    getFilteredVideos,
    addCategory,
    removeCategory,
    switchMode,
    togglePrivateMode,
    setViewMode,
    setCategory,
    setPlaying,
    toggleShuffle,
    toggleRepeat,
    buildPlaylist
};
