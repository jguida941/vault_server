/**
 * Playlist Manager - Playlist state and navigation
 * @module player/playlist
 */

import * as State from '../core/state.js';

let playlist = [];
let currentIndex = 0;
let shuffleMode = false;
let repeatMode = false;
let playHistory = [];

const listeners = new Map();

/**
 * Subscribe to playlist events
 * @param {string} event - Event name
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
function on(event, callback) {
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(callback);
    return () => listeners.get(event).delete(callback);
}

/**
 * Emit an event
 * @param {string} event - Event name
 * @param {*} data - Event data
 */
function emit(event, data) {
    if (listeners.has(event)) {
        listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error('Playlist: Event callback error:', e);
            }
        });
    }
}

/**
 * Initialize playlist from state
 */
function init() {
    playlist = State.getFilteredVideos();
    currentIndex = 0;
    shuffleMode = State.get('shuffleMode') || false;
    repeatMode = State.get('repeatMode') || false;
    playHistory = [];

    // Subscribe to state changes
    State.subscribe('shuffleMode', (value) => {
        shuffleMode = value;
        emit('shuffleChange', value);
    });

    State.subscribe('repeatMode', (value) => {
        repeatMode = value;
        emit('repeatChange', value);
    });
}

/**
 * Set playlist from videos array
 * @param {Array} videos - Array of video objects
 */
function setPlaylist(videos) {
    playlist = [...videos];
    currentIndex = 0;
    playHistory = [];
    emit('playlistChange', playlist);
}

/**
 * Get current playlist
 * @returns {Array} Playlist array
 */
function getPlaylist() {
    return [...playlist];
}

/**
 * Get playlist length
 * @returns {number} Number of items
 */
function getLength() {
    return playlist.length;
}

/**
 * Get current video
 * @returns {Object|null} Current video or null
 */
function getCurrent() {
    if (playlist.length === 0) return null;
    return playlist[currentIndex] || null;
}

/**
 * Get current index
 * @returns {number} Current index
 */
function getCurrentIndex() {
    return currentIndex;
}

/**
 * Play a specific index
 * @param {number} index - Index to play
 * @returns {Object|null} Video at index or null
 */
function playIndex(index) {
    if (index < 0 || index >= playlist.length) return null;

    // Add to history
    if (playlist[currentIndex]) {
        playHistory.push(currentIndex);
    }

    currentIndex = index;
    const video = playlist[currentIndex];
    emit('currentChange', { video, index: currentIndex });
    return video;
}

/**
 * Play next video
 * @returns {Object|null} Next video or null
 */
function next() {
    if (playlist.length === 0) return null;

    let nextIndex;

    if (shuffleMode) {
        // Shuffle: random different index
        if (playlist.length === 1) {
            nextIndex = 0;
        } else {
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (nextIndex === currentIndex);
        }
    } else {
        // Sequential
        nextIndex = currentIndex + 1;

        if (nextIndex >= playlist.length) {
            if (repeatMode) {
                nextIndex = 0;
            } else {
                emit('playlistEnd');
                return null;
            }
        }
    }

    return playIndex(nextIndex);
}

/**
 * Play previous video
 * @returns {Object|null} Previous video or null
 */
function previous() {
    if (playlist.length === 0) return null;

    let prevIndex;

    if (shuffleMode && playHistory.length > 0) {
        // In shuffle mode, go back through history
        prevIndex = playHistory.pop();
    } else {
        prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
            if (repeatMode) {
                prevIndex = playlist.length - 1;
            } else {
                prevIndex = 0;
            }
        }
    }

    // Don't add to history when going back
    currentIndex = prevIndex;
    const video = playlist[currentIndex];
    emit('currentChange', { video, index: currentIndex });
    return video;
}

/**
 * Toggle shuffle mode
 * @returns {boolean} New shuffle state
 */
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    State.set('shuffleMode', shuffleMode, true);
    playHistory = [];
    emit('shuffleChange', shuffleMode);
    return shuffleMode;
}

/**
 * Toggle repeat mode
 * @returns {boolean} New repeat state
 */
function toggleRepeat() {
    repeatMode = !repeatMode;
    State.set('repeatMode', repeatMode, true);
    emit('repeatChange', repeatMode);
    return repeatMode;
}

/**
 * Get shuffle mode
 * @returns {boolean} Shuffle mode
 */
function isShuffled() {
    return shuffleMode;
}

/**
 * Get repeat mode
 * @returns {boolean} Repeat mode
 */
function isRepeating() {
    return repeatMode;
}

/**
 * Add video to playlist
 * @param {Object} video - Video to add
 * @param {boolean} playNow - Whether to play immediately
 */
function add(video, playNow = false) {
    playlist.push(video);
    emit('playlistChange', playlist);

    if (playNow) {
        playIndex(playlist.length - 1);
    }
}

/**
 * Remove video from playlist
 * @param {number} index - Index to remove
 */
function remove(index) {
    if (index < 0 || index >= playlist.length) return;

    playlist.splice(index, 1);

    // Adjust current index if needed
    if (index < currentIndex) {
        currentIndex--;
    } else if (index === currentIndex) {
        if (currentIndex >= playlist.length) {
            currentIndex = Math.max(0, playlist.length - 1);
        }
    }

    emit('playlistChange', playlist);
}

/**
 * Clear playlist
 */
function clear() {
    playlist = [];
    currentIndex = 0;
    playHistory = [];
    emit('playlistChange', playlist);
}

/**
 * Shuffle playlist order
 * @param {boolean} keepCurrent - Keep current video in place
 */
function shuffle(keepCurrent = true) {
    if (playlist.length < 2) return;

    const current = playlist[currentIndex];

    // Fisher-Yates shuffle
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }

    // Move current to front if keeping
    if (keepCurrent && current) {
        const newIndex = playlist.findIndex(v => v.id === current.id);
        if (newIndex > 0) {
            playlist.splice(newIndex, 1);
            playlist.unshift(current);
        }
        currentIndex = 0;
    }

    emit('playlistChange', playlist);
}

/**
 * Find video by ID
 * @param {string} videoId - Video ID
 * @returns {number} Index or -1
 */
function findById(videoId) {
    return playlist.findIndex(v => v.id === videoId);
}

/**
 * Play video by ID
 * @param {string} videoId - Video ID
 * @returns {Object|null} Video or null
 */
function playById(videoId) {
    const index = findById(videoId);
    if (index === -1) return null;
    return playIndex(index);
}

export {
    init,
    on,
    setPlaylist,
    getPlaylist,
    getLength,
    getCurrent,
    getCurrentIndex,
    playIndex,
    next,
    previous,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    isRepeating,
    add,
    remove,
    clear,
    shuffle,
    findById,
    playById
};
