/**
 * The Vault - Main Application Entry Point
 * @module app
 */

import * as Storage from './core/storage.js';
import * as State from './core/state.js';
import * as ThemeManager from './theme/themeManager.js';
import { getThemeList } from './theme/themes.js';
import * as Notifications from './ui/notifications.js';
import * as Components from './ui/components.js';
import * as Validators from './utils/validators.js';
import * as Playlist from './player/playlist.js';

/**
 * Application configuration
 */
const CONFIG = {
    version: '2.0.0',
    defaultMode: 'launcher'
};

/**
 * DOM element references
 */
let elements = {};

/**
 * Initialize the application
 */
async function init() {
    console.log(`The Vault v${CONFIG.version} starting...`);

    // Initialize core systems
    State.init();
    Notifications.init();
    await ThemeManager.init(); // Load themes from JSON files
    Playlist.init();

    // Cache DOM elements
    cacheElements();

    // Set up event listeners
    setupEventListeners();

    // Subscribe to state changes
    setupStateSubscriptions();

    // Render initial UI
    renderCategories();
    renderVideos();
    renderThemes();
    updateStats();

    // Set initial mode
    switchMode(CONFIG.defaultMode);

    console.log('The Vault initialized');
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
    elements = {
        app: document.getElementById('app'),
        videoGrid: document.getElementById('video-grid'),
        categoryPills: document.getElementById('category-pills'),
        searchInput: document.getElementById('search-input'),
        videoInput: document.getElementById('video-input'),
        addVideoBtn: document.getElementById('add-video-btn'),
        themeGrid: document.getElementById('theme-grid'),
        trackCount: document.getElementById('track-count'),
        categoryCount: document.getElementById('category-count'),
        modeToggle: document.getElementById('mode-toggle'),
        viewToggle: document.getElementById('view-toggle')
    };
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Add video
    if (elements.addVideoBtn) {
        elements.addVideoBtn.addEventListener('click', handleAddVideo);
    }

    if (elements.videoInput) {
        elements.videoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddVideo();
        });
    }

    // Search
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }

    // Mode toggle
    if (elements.modeToggle) {
        elements.modeToggle.addEventListener('click', () => {
            State.togglePrivateMode();
        });
    }

    // View toggle
    if (elements.viewToggle) {
        elements.viewToggle.addEventListener('click', () => {
            const current = State.get('viewMode');
            State.setViewMode(current === 'grid' ? 'list' : 'grid');
        });
    }

    // Drag and drop
    setupDragDrop();

    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

/**
 * Set up state subscriptions
 */
function setupStateSubscriptions() {
    State.subscribe('videos', () => {
        renderVideos();
        updateStats();
    });

    State.subscribe('categories', () => {
        renderCategories();
        updateStats();
    });

    State.subscribe('currentCategory', () => {
        renderCategories();
        renderVideos();
    });

    State.subscribe('privateMode', (isPrivate) => {
        renderVideos();
        if (elements.modeToggle) {
            elements.modeToggle.classList.toggle('active', isPrivate);
        }
    });

    State.subscribe('viewMode', (mode) => {
        if (elements.videoGrid) {
            elements.videoGrid.className = `video-${mode}`;
        }
        renderVideos();
    });
}

/**
 * Handle adding a video
 */
function handleAddVideo() {
    const input = elements.videoInput;
    if (!input) return;

    const value = input.value.trim();
    if (!value) {
        Notifications.warning('Please enter a YouTube URL or video ID');
        return;
    }

    const videoId = Validators.extractVideoId(value);
    if (!videoId) {
        Notifications.error('Invalid YouTube URL or video ID');
        return;
    }

    // Prompt for title
    const title = prompt('Enter song/video title:');
    if (!title) return;

    // Prompt for artist
    const artist = prompt('Enter artist name:');
    if (!artist) return;

    // Prompt for category
    const categories = State.get('categories');
    const category = prompt(`Enter category (${categories.join(', ')}):`, categories[0]);
    if (!category) return;

    // Prompt for private mode
    const privateAnswer = prompt('Is this private? (yes/no):', 'no');
    if (privateAnswer === null) return;
    const isPrivate = privateAnswer.toLowerCase().startsWith('y');

    // Add video
    const success = State.addVideo({
        id: videoId,
        title: title.trim(),
        artist: artist.trim(),
        category: category.trim(),
        isPrivate: isPrivate
    });

    if (success) {
        input.value = '';
        Notifications.success(`Added "${artist} - ${title}" to your vault${isPrivate ? ' (Private)' : ''}`);
    } else {
        Notifications.error('Video already exists in your vault');
    }
}

/**
 * Handle search input
 */
function handleSearch() {
    const searchTerm = elements.searchInput?.value.toLowerCase() || '';
    renderVideos(searchTerm);
}

/**
 * Render category pills
 */
function renderCategories() {
    if (!elements.categoryPills) return;

    const categories = State.get('categories');
    const currentCategory = State.get('currentCategory');

    elements.categoryPills.innerHTML = '';

    // All category
    const allPill = Components.createCategoryPill('All', {
        isActive: currentCategory === 'all',
        onSelect: () => State.setCategory('all')
    });
    elements.categoryPills.appendChild(allPill);

    // User categories
    categories.forEach(cat => {
        const pill = Components.createCategoryPill(cat, {
            isActive: currentCategory === cat.toLowerCase().replace(/\s+/g, '-'),
            showDelete: true,
            onSelect: () => State.setCategory(cat.toLowerCase().replace(/\s+/g, '-')),
            onDelete: () => {
                if (confirm(`Delete category "${cat}"?`)) {
                    State.removeCategory(cat);
                    Notifications.success(`Deleted category "${cat}"`);
                }
            }
        });
        elements.categoryPills.appendChild(pill);
    });

    // Add category button
    const addBtn = Components.createButton({
        text: '+ Add',
        variant: 'text',
        size: 'small',
        onClick: handleAddCategory
    });
    elements.categoryPills.appendChild(addBtn);
}

/**
 * Handle adding a category
 */
function handleAddCategory() {
    const name = prompt('Enter new category name:');
    if (!name) return;

    const validation = Validators.validateCategoryName(name);
    if (!validation.valid) {
        Notifications.error(validation.error);
        return;
    }

    const success = State.addCategory(name.trim());
    if (success) {
        Notifications.success(`Added category "${name}"`);
    } else {
        Notifications.error('Category already exists');
    }
}

/**
 * Render video grid
 * @param {string} searchTerm - Optional search filter
 */
function renderVideos(searchTerm = '') {
    if (!elements.videoGrid) return;

    let videos = State.getFilteredVideos();

    // Apply search filter
    if (searchTerm) {
        videos = videos.filter(v =>
            v.title.toLowerCase().includes(searchTerm) ||
            v.category.toLowerCase().includes(searchTerm)
        );
    }

    elements.videoGrid.innerHTML = '';

    if (videos.length === 0) {
        elements.videoGrid.innerHTML = `
            <div class="empty-state">
                <p>No videos found</p>
                <p class="empty-state__hint">Add some videos to get started!</p>
            </div>
        `;
        return;
    }

    const viewMode = State.get('viewMode');

    videos.forEach(video => {
        const card = Components.createVideoCard(video, {
            viewMode,
            onPlay: (id) => playVideo(id),
            onDelete: (id) => {
                if (confirm(`Delete "${video.title}"?`)) {
                    State.removeVideo(id);
                    Notifications.success('Video deleted');
                }
            },
            onEdit: (video) => handleEditVideo(video)
        });
        elements.videoGrid.appendChild(card);
    });
}

/**
 * Handle editing a video
 * @param {Object} video - Video object to edit
 */
function handleEditVideo(video) {
    const categories = State.get('categories');

    // Create edit modal content
    const content = document.createElement('div');
    content.className = 'edit-video-form';
    content.innerHTML = `
        <div class="input-field" style="margin-bottom: 16px;">
            <label class="input-field__label">Title</label>
            <input type="text" id="edit-title" class="input-field__input" value="${video.title}">
        </div>
        <div class="input-field" style="margin-bottom: 16px;">
            <label class="input-field__label">Artist</label>
            <input type="text" id="edit-artist" class="input-field__input" value="${video.artist || ''}">
        </div>
        <div class="input-field" style="margin-bottom: 16px;">
            <label class="input-field__label">Category</label>
            <select id="edit-category" class="input-field__input" style="padding: 12px;">
                ${categories.map(cat => `
                    <option value="${cat}" ${cat === video.category ? 'selected' : ''}>${cat}</option>
                `).join('')}
            </select>
        </div>
        <div class="input-field" style="margin-bottom: 16px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="edit-private" ${video.isPrivate ? 'checked' : ''}>
                <span>Private (only visible in private mode)</span>
            </label>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <button class="btn btn--text" id="edit-cancel">Cancel</button>
            <button class="btn btn--filled" id="edit-save">Save Changes</button>
        </div>
    `;

    const modal = Components.createModal({
        title: 'Edit Video',
        content: content,
        closeOnBackdrop: true
    });

    modal.open();

    // Event listeners
    content.querySelector('#edit-cancel').addEventListener('click', () => modal.close());
    content.querySelector('#edit-save').addEventListener('click', () => {
        const newTitle = content.querySelector('#edit-title').value.trim();
        const newArtist = content.querySelector('#edit-artist').value.trim();
        const newCategory = content.querySelector('#edit-category').value;
        const newPrivate = content.querySelector('#edit-private').checked;

        if (!newTitle) {
            Notifications.error('Title cannot be empty');
            return;
        }

        // Update the video using Storage directly
        import('./core/storage.js').then(Storage => {
            Storage.updateVideo(video.id, {
                title: newTitle,
                artist: newArtist,
                category: newCategory,
                isPrivate: newPrivate
            });

            // Refresh state
            State.set('videos', Storage.getVideos());
            Notifications.success('Video updated');
            modal.close();
        });
    });
}

/**
 * Update stats display
 */
function updateStats() {
    const videos = State.get('videos');
    const categories = State.get('categories');

    if (elements.trackCount) {
        elements.trackCount.textContent = videos.length;
    }

    if (elements.categoryCount) {
        elements.categoryCount.textContent = categories.length;
    }
}

/**
 * Render theme grid
 */
function renderThemes() {
    if (!elements.themeGrid) return;

    const themes = getThemeList();
    const currentThemeId = ThemeManager.getCurrentThemeId();

    elements.themeGrid.innerHTML = '';

    themes.forEach(theme => {
        const card = Components.createThemeCard(theme, {
            isActive: theme.id === currentThemeId,
            onSelect: (themeId) => {
                ThemeManager.applyTheme(themeId);
                renderThemes(); // Re-render to update active state
                Notifications.success(`Theme changed to ${theme.name}`);
            }
        });
        elements.themeGrid.appendChild(card);
    });
}

// Player state
let playerState = {
    playlist: [],
    currentIndex: 0,
    visualizerActive: false,
    queueOpen: false
};

/**
 * Play a video - opens full screen overlay player with queue
 * @param {string} videoId - Video ID to play
 */
function playVideo(videoId) {
    // Remove any existing player
    const existingPlayer = document.getElementById('fullscreen-player');
    if (existingPlayer) {
        existingPlayer.remove();
    }

    // Build playlist from filtered videos
    playerState.playlist = State.getFilteredVideos();
    playerState.currentIndex = playerState.playlist.findIndex(v => v.id === videoId);
    if (playerState.currentIndex === -1) playerState.currentIndex = 0;

    const video = playerState.playlist[playerState.currentIndex];
    const title = video ? video.title : 'Now Playing';

    // Build queue HTML with drag support
    const queueHTML = playerState.playlist.map((v, i) => `
        <div class="queue-item ${i === playerState.currentIndex ? 'queue-item--active' : ''}" data-index="${i}" draggable="true">
            <div class="queue-item__drag">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </div>
            <img src="https://img.youtube.com/vi/${v.id}/default.jpg" alt="">
            <div class="queue-item__info">
                <div class="queue-item__title">${v.title}</div>
                <div class="queue-item__artist">${v.artist || ''}</div>
            </div>
        </div>
    `).join('');

    // Create full-screen overlay player
    const playerOverlay = document.createElement('div');
    playerOverlay.id = 'fullscreen-player';
    playerOverlay.innerHTML = `
        <div class="player-overlay__header">
            <div class="player-overlay__info">
                <div class="player-overlay__title" id="player-title">${title}</div>
                <div class="player-overlay__index">${playerState.currentIndex + 1} of ${playerState.playlist.length}</div>
            </div>
            <div class="player-overlay__controls">
                <div class="visualizer-dropdown">
                    <button class="player-overlay__btn" id="visualizer-btn" title="Toggle Visualizer">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>
                    </button>
                    <div class="visualizer-dropdown__menu" id="visualizer-menu">
                        <button class="visualizer-dropdown__item active" data-mode="bars">Bars</button>
                        <button class="visualizer-dropdown__item" data-mode="wave">Wave</button>
                        <button class="visualizer-dropdown__item" data-mode="particles">Particles</button>
                        <button class="visualizer-dropdown__item" data-mode="sphere">Sphere</button>
                        <button class="visualizer-dropdown__item" data-mode="kaleidoscope">Kaleidoscope</button>
                        <button class="visualizer-dropdown__item visualizer-dropdown__off" data-mode="off">Off</button>
                    </div>
                </div>
                <button class="player-overlay__btn" id="shuffle-btn" title="Shuffle">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                </button>
                <button class="player-overlay__btn" id="prev-btn" title="Previous">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button class="player-overlay__btn" id="next-btn" title="Next">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
                <button class="player-overlay__btn" id="queue-btn" title="Queue">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>
                </button>
                <button class="player-overlay__close" id="close-player" title="Close">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
        </div>
        <div class="player-overlay__video player-video" id="video-container">
            <iframe
                id="player-iframe"
                src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowfullscreen
            ></iframe>
            <canvas id="visualizer-canvas" class="player-visualizer"></canvas>
        </div>
        <div class="player-queue" id="player-queue">
            <div class="player-queue__header">
                <h3>Queue</h3>
                <span>${playerState.playlist.length} tracks</span>
            </div>
            <div class="player-queue__list" id="queue-list">
                ${queueHTML}
            </div>
        </div>
    `;

    document.body.appendChild(playerOverlay);
    document.body.style.overflow = 'hidden';

    // Event listeners
    document.getElementById('close-player').addEventListener('click', closePlayer);
    document.getElementById('prev-btn').addEventListener('click', () => playAdjacentVideo(-1));
    document.getElementById('next-btn').addEventListener('click', () => playAdjacentVideo(1));
    document.getElementById('queue-btn').addEventListener('click', toggleQueue);
    document.getElementById('shuffle-btn').addEventListener('click', shuffleAndPlay);

    // Visualizer dropdown toggle
    const vizBtn = document.getElementById('visualizer-btn');
    const vizMenu = document.getElementById('visualizer-menu');
    vizBtn.addEventListener('click', () => {
        vizMenu.classList.toggle('visualizer-dropdown__menu--open');
    });

    // Visualizer dropdown item clicks
    document.querySelectorAll('.visualizer-dropdown__item').forEach(item => {
        item.addEventListener('click', () => {
            const mode = item.dataset.mode;
            document.querySelectorAll('.visualizer-dropdown__item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            vizMenu.classList.remove('visualizer-dropdown__menu--open');

            if (mode === 'off') {
                playerState.visualizerActive = false;
                const canvas = document.getElementById('visualizer-canvas');
                canvas.classList.remove('player-visualizer--active');
                stopVisualizer();
            } else {
                setVisualizerMode(mode);
                if (!playerState.visualizerActive) {
                    playerState.visualizerActive = true;
                    const canvas = document.getElementById('visualizer-canvas');
                    canvas.classList.add('player-visualizer--active');
                    startVisualizer();
                }
            }
        });
    });

    // Queue item clicks
    document.querySelectorAll('.queue-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger play when dragging
            if (e.target.closest('.queue-item__drag')) return;
            const index = parseInt(item.dataset.index);
            playFromQueue(index);
        });
    });

    // Queue drag-to-reorder
    let draggedItem = null;
    document.querySelectorAll('.queue-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('queue-item--dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('queue-item--dragging');
            document.querySelectorAll('.queue-item--dragover').forEach(el => {
                el.classList.remove('queue-item--dragover');
            });
            draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (item !== draggedItem) {
                item.classList.add('queue-item--dragover');
            }
        });

        item.addEventListener('dragleave', () => {
            item.classList.remove('queue-item--dragover');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('queue-item--dragover');
            if (draggedItem && draggedItem !== item) {
                const fromIndex = parseInt(draggedItem.dataset.index);
                const toIndex = parseInt(item.dataset.index);
                reorderPlaylist(fromIndex, toIndex);
            }
        });
    });

    // Keyboard shortcuts
    const keyHandler = (e) => {
        if (e.key === 'Escape') {
            closePlayer();
            document.removeEventListener('keydown', keyHandler);
        } else if (e.key === 'ArrowRight') {
            playAdjacentVideo(1);
        } else if (e.key === 'ArrowLeft') {
            playAdjacentVideo(-1);
        } else if (e.key === 'q') {
            toggleQueue();
        } else if (e.key === 'v') {
            toggleVisualizer();
        } else if (e.key === '1') {
            setVisualizerMode('bars');
        } else if (e.key === '2') {
            setVisualizerMode('wave');
        } else if (e.key === '3') {
            setVisualizerMode('particles');
        } else if (e.key === '4') {
            setVisualizerMode('sphere');
        } else if (e.key === '5') {
            setVisualizerMode('kaleidoscope');
        }
    };
    document.addEventListener('keydown', keyHandler);

    State.setPlaying(videoId);
}

/**
 * Play from queue at specific index
 */
function playFromQueue(index) {
    if (index < 0 || index >= playerState.playlist.length) return;

    playerState.currentIndex = index;
    const video = playerState.playlist[index];

    // Update iframe
    const iframe = document.getElementById('player-iframe');
    if (iframe) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`;
    }

    // Update title
    const titleEl = document.getElementById('player-title');
    if (titleEl) titleEl.textContent = video.title;

    // Update index display
    const indexEl = document.querySelector('.player-overlay__index');
    if (indexEl) indexEl.textContent = `${index + 1} of ${playerState.playlist.length}`;

    // Update queue active state
    document.querySelectorAll('.queue-item').forEach((item, i) => {
        item.classList.toggle('queue-item--active', i === index);
    });

    // Auto-close queue after selection (always close)
    playerState.queueOpen = false;
    const queue = document.getElementById('player-queue');
    if (queue) queue.classList.remove('player-queue--open');

    State.setPlaying(video.id);
}

/**
 * Reorder playlist by moving item from one index to another
 */
function reorderPlaylist(fromIndex, toIndex) {
    const [movedItem] = playerState.playlist.splice(fromIndex, 1);
    playerState.playlist.splice(toIndex, 0, movedItem);

    // Adjust current index if needed
    if (playerState.currentIndex === fromIndex) {
        playerState.currentIndex = toIndex;
    } else if (fromIndex < playerState.currentIndex && toIndex >= playerState.currentIndex) {
        playerState.currentIndex--;
    } else if (fromIndex > playerState.currentIndex && toIndex <= playerState.currentIndex) {
        playerState.currentIndex++;
    }

    // Update queue display
    const queueList = document.getElementById('queue-list');
    if (queueList) {
        queueList.innerHTML = playerState.playlist.map((v, i) => `
            <div class="queue-item ${i === playerState.currentIndex ? 'queue-item--active' : ''}" data-index="${i}" draggable="true">
                <div class="queue-item__drag">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
                <img src="https://img.youtube.com/vi/${v.id}/default.jpg" alt="">
                <div class="queue-item__info">
                    <div class="queue-item__title">${v.title}</div>
                    <div class="queue-item__artist">${v.artist || ''}</div>
                </div>
            </div>
        `).join('');

        // Re-attach event listeners
        attachQueueItemListeners();
    }

    // Update index display
    const indexEl = document.querySelector('.player-overlay__index');
    if (indexEl) indexEl.textContent = `${playerState.currentIndex + 1} of ${playerState.playlist.length}`;

    Notifications.success('Queue reordered');
}

/**
 * Attach event listeners to queue items (after reorder)
 */
function attachQueueItemListeners() {
    let draggedItem = null;
    document.querySelectorAll('.queue-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.queue-item__drag')) return;
            const index = parseInt(item.dataset.index);
            playFromQueue(index);
        });

        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('queue-item--dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('queue-item--dragging');
            document.querySelectorAll('.queue-item--dragover').forEach(el => {
                el.classList.remove('queue-item--dragover');
            });
            draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (item !== draggedItem) {
                item.classList.add('queue-item--dragover');
            }
        });

        item.addEventListener('dragleave', () => {
            item.classList.remove('queue-item--dragover');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('queue-item--dragover');
            if (draggedItem && draggedItem !== item) {
                const fromIndex = parseInt(draggedItem.dataset.index);
                const toIndex = parseInt(item.dataset.index);
                reorderPlaylist(fromIndex, toIndex);
            }
        });
    });
}

/**
 * Toggle queue sidebar
 */
function toggleQueue() {
    playerState.queueOpen = !playerState.queueOpen;
    const queue = document.getElementById('player-queue');
    if (queue) {
        queue.classList.toggle('player-queue--open', playerState.queueOpen);
    }
}

// Visualizer modes and state
let visualizerMode = 'bars'; // bars, wave, particles, sphere, kaleidoscope
let particles = [];
const visualizerModes = ['bars', 'wave', 'particles', 'sphere', 'kaleidoscope'];

/**
 * Toggle visualizer (keyboard shortcut)
 */
function toggleVisualizer() {
    playerState.visualizerActive = !playerState.visualizerActive;
    const canvas = document.getElementById('visualizer-canvas');
    const menuItems = document.querySelectorAll('.visualizer-dropdown__item');

    if (playerState.visualizerActive) {
        canvas.classList.add('player-visualizer--active');
        startVisualizer();
        // Update dropdown to show active mode
        menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.mode === visualizerMode);
        });
        Notifications.success(`Visualizer: ${visualizerMode.toUpperCase()}`);
    } else {
        canvas.classList.remove('player-visualizer--active');
        stopVisualizer();
        // Update dropdown to show off
        menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.mode === 'off');
        });
    }
}

/**
 * Change visualizer mode
 */
function setVisualizerMode(mode) {
    visualizerMode = mode;
    particles = [];
    Notifications.success(`Visualizer: ${mode.toUpperCase()}`);
}

let visualizerAnimationId = null;
let dataArray = new Uint8Array(128);

/**
 * Start visualizer animation
 */
function startVisualizer() {
    const canvas = document.getElementById('visualizer-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Match canvas size to parent container (player-video)
    const videoContainer = canvas.parentElement;
    if (videoContainer) {
        const rect = videoContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw() {
        if (!playerState.visualizerActive) return;

        const time = Date.now() * 0.001;
        const beatFreq = 2;
        const beat = Math.sin(time * beatFreq * Math.PI) > 0.7 ? 1 : 0;
        const subBeat = Math.sin(time * beatFreq * 4 * Math.PI) > 0.85 ? 0.5 : 0;

        // Simulate audio data
        for (let i = 0; i < dataArray.length; i++) {
            if (i < 15) {
                dataArray[i] = (beat * 200 + subBeat * 100 + Math.random() * 55) * (0.8 + Math.sin(time * 2 + i) * 0.2);
            } else if (i < 60) {
                dataArray[i] = (beat * 100 + Math.random() * 100) * (0.6 + Math.sin(time * 3 + i * 0.5) * 0.4);
            } else {
                dataArray[i] = Math.random() * 80 * (0.5 + Math.sin(time * 5 + i * 0.2) * 0.5);
            }
        }

        // Clear canvas completely (transparent - lets video show through)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (visualizerMode) {
            case 'bars':
                drawBars(ctx, canvas);
                break;
            case 'wave':
                drawWave(ctx, canvas);
                break;
            case 'particles':
                drawParticles(ctx, canvas);
                break;
            case 'sphere':
                drawSphere(ctx, canvas);
                break;
            case 'kaleidoscope':
                drawKaleidoscope(ctx, canvas);
                break;
        }

        visualizerAnimationId = requestAnimationFrame(draw);
    }

    draw();
}

function drawBars(ctx, canvas) {
    const barCount = 64;
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
        const barHeight = (dataArray[Math.floor(i * dataArray.length / barCount)] / 255) * canvas.height * 0.6;
        const hue = (i / barCount) * 360;

        // Glow effect
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        ctx.shadowBlur = 15;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 40%, 1)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
    ctx.shadowBlur = 0;
}

function drawWave(ctx, canvas) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#6750A4';
    ctx.shadowColor = '#6750A4';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255;
        const y = v * canvas.height / 2 + canvas.height / 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }
    ctx.stroke();

    // Mirror wave
    ctx.strokeStyle = '#E91E63';
    ctx.shadowColor = '#E91E63';
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255;
        const y = canvas.height - (v * canvas.height / 2 + canvas.height / 4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawParticles(ctx, canvas) {
    const bass = dataArray.slice(0, 15).reduce((a, b) => a + b) / 15 / 255;

    // Spawn particles on beat
    if (bass > 0.5 && particles.length < 500) {
        const count = Math.floor(bass * 15);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + bass * 15;
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 8 + 3,
                hue: Math.random() * 360,
                life: 1
            });
        }
    }

    // Update and draw particles
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.99;
        p.life -= 0.015;
        p.size *= 0.98;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue}, 100%, 60%)`;
        ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.life > 0 && p.size > 0.5;
    });
}

function drawSphere(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < dataArray.length; i++) {
        const angle = (i / dataArray.length) * Math.PI * 2;
        const amp = dataArray[i] / 255;
        const r = radius + amp * 100;

        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, `hsla(${i * 360 / dataArray.length}, 100%, 60%, 1)`);
        gradient.addColorStop(1, `hsla(${i * 360 / dataArray.length}, 100%, 30%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 5 + amp * 15, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function drawKaleidoscope(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sections = 6;

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let s = 0; s < sections; s++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / sections) * s);

        for (let i = 0; i < dataArray.length / 4; i++) {
            const angle = (i / (dataArray.length / 4)) * Math.PI / 3;
            const amp = dataArray[i] / 255;
            const r = 50 + i * 5 + amp * 50;

            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            ctx.fillStyle = `hsla(${(s * 60 + i * 10) % 360}, 100%, 50%, ${amp})`;
            ctx.fillRect(x, y, 5, 5);
        }

        ctx.restore();
    }

    ctx.restore();
}

/**
 * Stop visualizer animation
 */
function stopVisualizer() {
    if (visualizerAnimationId) {
        cancelAnimationFrame(visualizerAnimationId);
        visualizerAnimationId = null;
    }
}

/**
 * Shuffle playlist and start playing
 */
function shuffleAndPlay() {
    // Fisher-Yates shuffle
    for (let i = playerState.playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playerState.playlist[i], playerState.playlist[j]] = [playerState.playlist[j], playerState.playlist[i]];
    }

    // Rebuild queue display
    const queueList = document.getElementById('queue-list');
    if (queueList) {
        queueList.innerHTML = playerState.playlist.map((v, i) => `
            <div class="queue-item ${i === 0 ? 'queue-item--active' : ''}" data-index="${i}">
                <img src="https://img.youtube.com/vi/${v.id}/default.jpg" alt="">
                <div class="queue-item__info">
                    <div class="queue-item__title">${v.title}</div>
                    <div class="queue-item__artist">${v.artist || ''}</div>
                </div>
            </div>
        `).join('');

        // Re-attach click listeners
        document.querySelectorAll('.queue-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                playFromQueue(index);
            });
        });
    }

    // Play first track
    playFromQueue(0);
    Notifications.success('Playlist shuffled');
}

/**
 * Close the fullscreen player
 */
function closePlayer() {
    stopVisualizer();
    const player = document.getElementById('fullscreen-player');
    if (player) {
        player.remove();
        document.body.style.overflow = '';
        State.setPlaying(null);
    }
}

/**
 * Play adjacent video in the filtered list
 * @param {number} direction - 1 for next, -1 for previous
 */
function playAdjacentVideo(direction) {
    let newIndex = playerState.currentIndex + direction;
    if (newIndex < 0) newIndex = playerState.playlist.length - 1;
    if (newIndex >= playerState.playlist.length) newIndex = 0;

    playFromQueue(newIndex);
}

/**
 * Switch application mode
 * @param {string} mode - Mode name
 */
function switchMode(mode) {
    State.switchMode(mode);

    // Hide all mode sections
    document.querySelectorAll('[data-mode]').forEach(el => {
        el.style.display = 'none';
    });

    // Show active mode
    const activeSection = document.querySelector(`[data-mode="${mode}"]`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Update nav
    document.querySelectorAll('[data-mode-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.modeBtn === mode);
    });
}

/**
 * Set up drag and drop
 */
function setupDragDrop() {
    const app = elements.app;
    if (!app) return;

    let dragCounter = 0;

    app.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dragCounter++;
        app.classList.add('drag-active');
    });

    app.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            app.classList.remove('drag-active');
        }
    });

    app.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    app.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCounter = 0;
        app.classList.remove('drag-active');

        const files = Array.from(e.dataTransfer.files);
        const jsonFile = files.find(f => f.name.endsWith('.json'));

        if (jsonFile) {
            handleImport(jsonFile);
        } else {
            Notifications.error('Please drop a JSON file');
        }
    });
}

/**
 * Handle file import
 * @param {File} file - JSON file
 */
function handleImport(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const validation = Validators.validateImportData(data);

            if (!validation.valid) {
                Notifications.error(`Invalid file: ${validation.errors[0]}`);
                return;
            }

            const result = Storage.importData(data);
            State.init(); // Refresh state from storage

            Notifications.success(
                `Imported ${result.imported} videos` +
                (result.duplicates > 0 ? ` (${result.duplicates} duplicates skipped)` : '')
            );
        } catch (err) {
            Notifications.error('Failed to parse JSON file');
        }
    };

    reader.readAsText(file);
}

/**
 * Set up keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case '/':
                e.preventDefault();
                elements.searchInput?.focus();
                break;
            case 'Escape':
                elements.searchInput?.blur();
                break;
            case 't':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    ThemeManager.toggleDarkMode();
                }
                break;
        }
    });
}

/**
 * Export collection
 */
function exportCollection() {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    Notifications.success('Collection exported');
}

/**
 * Clear collection
 */
function clearCollection() {
    if (confirm('Are you sure you want to clear your entire vault? This cannot be undone!')) {
        Storage.clearAll();
        State.init();
        Notifications.success('Vault cleared');
    }
}

// Export public API
export {
    init,
    switchMode,
    playVideo,
    exportCollection,
    clearCollection
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
