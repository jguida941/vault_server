/**
 * YouTube Player - YouTube IFrame API wrapper
 * @module player/youtubePlayer
 */

let player = null;
let isAPIReady = false;
let pendingVideoId = null;
const listeners = new Map();

// Player states (matching YT.PlayerState)
const PLAYER_STATE = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
};

/**
 * Load YouTube IFrame API
 * @returns {Promise} Resolves when API is ready
 */
function loadAPI() {
    return new Promise((resolve, reject) => {
        if (isAPIReady) {
            resolve();
            return;
        }

        // Check if already loading
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            // Wait for existing load
            const checkReady = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    isAPIReady = true;
                    clearInterval(checkReady);
                    resolve();
                }
            }, 100);
            return;
        }

        // Create callback
        window.onYouTubeIframeAPIReady = () => {
            isAPIReady = true;
            resolve();
        };

        // Load script
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = () => reject(new Error('Failed to load YouTube API'));
        document.head.appendChild(script);
    });
}

/**
 * Create a player instance
 * @param {string|HTMLElement} container - Container element or ID
 * @param {Object} options - Player options
 * @returns {Promise} Resolves with player instance
 */
async function create(container, options = {}) {
    await loadAPI();

    const {
        videoId,
        width = '100%',
        height = '100%',
        autoplay = true,
        controls = true,
        onReady,
        onStateChange,
        onError
    } = options;

    return new Promise((resolve, reject) => {
        try {
            player = new window.YT.Player(container, {
                width,
                height,
                videoId,
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    controls: controls ? 1 : 0,
                    modestbranding: 1,
                    rel: 0,
                    fs: 1,
                    playsinline: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        if (onReady) onReady(event);
                        emit('ready', event);
                        resolve(player);
                    },
                    onStateChange: (event) => {
                        if (onStateChange) onStateChange(event);
                        emit('stateChange', event);

                        // Emit specific state events
                        switch (event.data) {
                            case PLAYER_STATE.PLAYING:
                                emit('play', event);
                                break;
                            case PLAYER_STATE.PAUSED:
                                emit('pause', event);
                                break;
                            case PLAYER_STATE.ENDED:
                                emit('ended', event);
                                break;
                            case PLAYER_STATE.BUFFERING:
                                emit('buffering', event);
                                break;
                        }
                    },
                    onError: (event) => {
                        if (onError) onError(event);
                        emit('error', event);
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Subscribe to player events
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
                console.error('YouTubePlayer: Event callback error:', e);
            }
        });
    }
}

/**
 * Play video
 */
function play() {
    if (player && player.playVideo) {
        player.playVideo();
    }
}

/**
 * Pause video
 */
function pause() {
    if (player && player.pauseVideo) {
        player.pauseVideo();
    }
}

/**
 * Stop video
 */
function stop() {
    if (player && player.stopVideo) {
        player.stopVideo();
    }
}

/**
 * Load a video by ID
 * @param {string} videoId - YouTube video ID
 * @param {number} startSeconds - Start time in seconds
 */
function loadVideo(videoId, startSeconds = 0) {
    if (player && player.loadVideoById) {
        player.loadVideoById({
            videoId,
            startSeconds
        });
    } else {
        pendingVideoId = videoId;
    }
}

/**
 * Cue a video by ID (doesn't start playing)
 * @param {string} videoId - YouTube video ID
 * @param {number} startSeconds - Start time in seconds
 */
function cueVideo(videoId, startSeconds = 0) {
    if (player && player.cueVideoById) {
        player.cueVideoById({
            videoId,
            startSeconds
        });
    }
}

/**
 * Seek to a specific time
 * @param {number} seconds - Time in seconds
 * @param {boolean} allowSeekAhead - Allow seeking beyond buffered content
 */
function seekTo(seconds, allowSeekAhead = true) {
    if (player && player.seekTo) {
        player.seekTo(seconds, allowSeekAhead);
    }
}

/**
 * Set volume
 * @param {number} volume - Volume (0-100)
 */
function setVolume(volume) {
    if (player && player.setVolume) {
        player.setVolume(Math.max(0, Math.min(100, volume)));
    }
}

/**
 * Get current volume
 * @returns {number} Volume (0-100)
 */
function getVolume() {
    if (player && player.getVolume) {
        return player.getVolume();
    }
    return 100;
}

/**
 * Mute audio
 */
function mute() {
    if (player && player.mute) {
        player.mute();
    }
}

/**
 * Unmute audio
 */
function unmute() {
    if (player && player.unMute) {
        player.unMute();
    }
}

/**
 * Check if muted
 * @returns {boolean} Is muted
 */
function isMuted() {
    if (player && player.isMuted) {
        return player.isMuted();
    }
    return false;
}

/**
 * Set playback rate
 * @param {number} rate - Playback rate (0.25-2)
 */
function setPlaybackRate(rate) {
    if (player && player.setPlaybackRate) {
        player.setPlaybackRate(rate);
    }
}

/**
 * Get playback rate
 * @returns {number} Playback rate
 */
function getPlaybackRate() {
    if (player && player.getPlaybackRate) {
        return player.getPlaybackRate();
    }
    return 1;
}

/**
 * Get current time
 * @returns {number} Current time in seconds
 */
function getCurrentTime() {
    if (player && player.getCurrentTime) {
        return player.getCurrentTime();
    }
    return 0;
}

/**
 * Get video duration
 * @returns {number} Duration in seconds
 */
function getDuration() {
    if (player && player.getDuration) {
        return player.getDuration();
    }
    return 0;
}

/**
 * Get player state
 * @returns {number} Player state
 */
function getState() {
    if (player && player.getPlayerState) {
        return player.getPlayerState();
    }
    return PLAYER_STATE.UNSTARTED;
}

/**
 * Check if playing
 * @returns {boolean} Is playing
 */
function isPlaying() {
    return getState() === PLAYER_STATE.PLAYING;
}

/**
 * Get video data
 * @returns {Object} Video data
 */
function getVideoData() {
    if (player && player.getVideoData) {
        return player.getVideoData();
    }
    return {};
}

/**
 * Destroy player instance
 */
function destroy() {
    if (player && player.destroy) {
        player.destroy();
        player = null;
    }
    listeners.clear();
}

/**
 * Get the player instance
 * @returns {Object} Player instance
 */
function getInstance() {
    return player;
}

export {
    PLAYER_STATE,
    loadAPI,
    create,
    on,
    play,
    pause,
    stop,
    loadVideo,
    cueVideo,
    seekTo,
    setVolume,
    getVolume,
    mute,
    unmute,
    isMuted,
    setPlaybackRate,
    getPlaybackRate,
    getCurrentTime,
    getDuration,
    getState,
    isPlaying,
    getVideoData,
    destroy,
    getInstance
};
