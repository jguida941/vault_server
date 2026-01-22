/**
 * UI Components - Reusable component builders
 * @module ui/components
 */

import { sanitizeHTML, sanitizeAttribute } from '../utils/validators.js';
import { getIcon, ICONS } from './icons.js';

/**
 * Create a video card element
 * @param {Object} video - Video object
 * @param {Object} options - Card options
 * @returns {HTMLElement} Video card element
 */
function createVideoCard(video, options = {}) {
    const { onPlay, onDelete, onEdit, viewMode = 'grid' } = options;

    const card = document.createElement('div');
    card.className = `video-card video-card--${viewMode}`;
    card.dataset.videoId = video.id;

    const thumbnail = `https://img.youtube.com/vi/${sanitizeAttribute(video.id)}/mqdefault.jpg`;

    card.innerHTML = `
        <div class="video-card__thumbnail">
            <img src="${thumbnail}" alt="${sanitizeAttribute(video.title)}" loading="lazy">
            <div class="video-card__overlay">
                <button class="video-card__play-btn" aria-label="Play video">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="video-card__content">
            <h3 class="video-card__title">${sanitizeHTML(video.title)}</h3>
            ${video.artist ? `<p class="video-card__artist">${sanitizeHTML(video.artist)}</p>` : ''}
            <div class="video-card__meta">
                <span class="video-card__category">${sanitizeHTML(video.category)}</span>
                ${video.isPrivate ? '<span class="video-card__private">Private</span>' : ''}
            </div>
        </div>
        <div class="video-card__actions">
            <button class="video-card__edit" aria-label="Edit video">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </button>
            <button class="video-card__delete" aria-label="Delete video">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </div>
    `;

    // Event listeners
    const playBtn = card.querySelector('.video-card__play-btn');
    const deleteBtn = card.querySelector('.video-card__delete');
    const editBtn = card.querySelector('.video-card__edit');

    if (onPlay) {
        playBtn.addEventListener('click', () => onPlay(video.id));
        card.querySelector('.video-card__thumbnail').addEventListener('click', () => onPlay(video.id));
    }

    if (onDelete) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete(video.id);
        });
    }

    if (onEdit) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onEdit(video);
        });
    }

    return card;
}

/**
 * Create a category pill element
 * @param {string} category - Category name
 * @param {Object} options - Pill options
 * @returns {HTMLElement} Category pill element
 */
function createCategoryPill(category, options = {}) {
    const { isActive = false, onSelect, onDelete, showDelete = false } = options;

    const pill = document.createElement('button');
    pill.className = `category-pill ${isActive ? 'category-pill--active' : ''}`;
    pill.dataset.category = category.toLowerCase().replace(/\s+/g, '-');

    pill.innerHTML = `
        <span class="category-pill__text">${sanitizeHTML(category)}</span>
        ${showDelete ? `
            <span class="category-pill__delete" aria-label="Delete category">×</span>
        ` : ''}
    `;

    if (onSelect) {
        pill.addEventListener('click', (e) => {
            if (!e.target.classList.contains('category-pill__delete')) {
                onSelect(category);
            }
        });
    }

    if (onDelete && showDelete) {
        const deleteBtn = pill.querySelector('.category-pill__delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete(category);
        });
    }

    return pill;
}

/**
 * Create a theme card element
 * @param {Object} theme - Theme metadata
 * @param {Object} options - Card options
 * @returns {HTMLElement} Theme card element
 */
function createThemeCard(theme, options = {}) {
    const { isActive = false, onSelect } = options;

    const card = document.createElement('button');
    card.className = `theme-card ${isActive ? 'theme-card--active' : ''}`;
    card.dataset.themeId = theme.id;

    // Create preview gradient
    const previewColors = Array.isArray(theme.preview)
        ? theme.preview.join(', ')
        : 'var(--md-sys-color-primary), var(--md-sys-color-secondary)';

    // Get the appropriate icon
    const themeIcon = getIcon(theme.icon || 'palette', { size: 24 });
    const modeIcon = getIcon(theme.isDark ? 'darkMode' : 'lightMode', { size: 16 });

    card.innerHTML = `
        <div class="theme-card__preview" style="background: linear-gradient(135deg, ${previewColors})"></div>
        <div class="theme-card__content">
            <span class="theme-card__icon">${themeIcon}</span>
            <span class="theme-card__name">${sanitizeHTML(theme.name)}</span>
            <span class="theme-card__desc">${sanitizeHTML(theme.description)}</span>
        </div>
        <div class="theme-card__mode">${modeIcon}</div>
    `;

    if (onSelect) {
        card.addEventListener('click', () => onSelect(theme.id));
    }

    return card;
}

/**
 * Create a modal dialog
 * @param {Object} options - Modal options
 * @returns {Object} Modal API { element, open, close }
 */
function createModal(options = {}) {
    const { title = '', content = '', onClose, closeOnBackdrop = true } = options;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__container">
            <div class="modal__header">
                <h2 class="modal__title" id="modal-title">${sanitizeHTML(title)}</h2>
                <button class="modal__close" aria-label="Close modal">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="modal__content"></div>
        </div>
    `;

    const contentEl = modal.querySelector('.modal__content');
    if (typeof content === 'string') {
        contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        contentEl.appendChild(content);
    }

    const closeBtn = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');

    function close() {
        modal.classList.remove('modal--open');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
        if (onClose) onClose();
    }

    function open() {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        // Trigger reflow
        modal.offsetHeight;
        modal.classList.add('modal--open');
    }

    closeBtn.addEventListener('click', close);
    if (closeOnBackdrop) {
        backdrop.addEventListener('click', close);
    }

    // ESC key closes modal
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    return { element: modal, open, close };
}

/**
 * Create a button element
 * @param {Object} options - Button options
 * @returns {HTMLElement} Button element
 */
function createButton(options = {}) {
    const {
        text = '',
        icon = '',
        variant = 'filled', // filled, outlined, text, tonal
        size = 'medium', // small, medium, large
        onClick,
        disabled = false
    } = options;

    const button = document.createElement('button');
    button.className = `btn btn--${variant} btn--${size}`;
    button.disabled = disabled;

    button.innerHTML = `
        ${icon ? `<span class="btn__icon">${icon}</span>` : ''}
        ${text ? `<span class="btn__text">${sanitizeHTML(text)}</span>` : ''}
    `;

    if (onClick) {
        button.addEventListener('click', onClick);
    }

    return button;
}

/**
 * Create an input field
 * @param {Object} options - Input options
 * @returns {HTMLElement} Input container element
 */
function createInput(options = {}) {
    const {
        type = 'text',
        label = '',
        placeholder = '',
        value = '',
        id = `input-${Date.now()}`,
        onChange,
        onSubmit
    } = options;

    const container = document.createElement('div');
    container.className = 'input-field';

    container.innerHTML = `
        ${label ? `<label class="input-field__label" for="${id}">${sanitizeHTML(label)}</label>` : ''}
        <input
            type="${type}"
            id="${id}"
            class="input-field__input"
            placeholder="${sanitizeAttribute(placeholder)}"
            value="${sanitizeAttribute(value)}"
        >
    `;

    const input = container.querySelector('input');

    if (onChange) {
        input.addEventListener('input', (e) => onChange(e.target.value));
    }

    if (onSubmit) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onSubmit(e.target.value);
            }
        });
    }

    return container;
}

/**
 * Create a loading spinner
 * @param {string} size - Size: small, medium, large
 * @returns {HTMLElement} Spinner element
 */
function createSpinner(size = 'medium') {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner--${size}`;
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = `
        <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4"/>
        </svg>
        <span class="visually-hidden">Loading...</span>
    `;
    return spinner;
}

export {
    createVideoCard,
    createCategoryPill,
    createThemeCard,
    createModal,
    createButton,
    createInput,
    createSpinner
};
