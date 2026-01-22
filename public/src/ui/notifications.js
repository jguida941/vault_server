/**
 * Notifications - Toast notification system
 * @module ui/notifications
 */

import { sanitizeHTML } from '../utils/validators.js';

const TOAST_DURATION = 3000;
const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    error: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
};

const TOAST_TYPES = {
    success: { icon: TOAST_ICONS.success, class: 'toast--success' },
    error: { icon: TOAST_ICONS.error, class: 'toast--error' },
    warning: { icon: TOAST_ICONS.warning, class: 'toast--warning' },
    info: { icon: TOAST_ICONS.info, class: 'toast--info' }
};

let toastContainer = null;
let toastQueue = [];
let isProcessing = false;

/**
 * Initialize toast container
 */
function init() {
    if (toastContainer) return;

    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, warning, info
 * @param {number} duration - Duration in ms
 */
function show(message, type = 'success', duration = TOAST_DURATION) {
    init();

    const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.info;

    toastQueue.push({
        message: sanitizeHTML(message),
        icon: toastConfig.icon,
        className: toastConfig.class,
        duration
    });

    processQueue();
}

/**
 * Process toast queue
 */
function processQueue() {
    if (isProcessing || toastQueue.length === 0) return;

    isProcessing = true;
    const toast = toastQueue.shift();

    const element = document.createElement('div');
    element.className = `toast ${toast.className}`;
    element.innerHTML = `
        <span class="toast__icon">${toast.icon}</span>
        <span class="toast__message">${toast.message}</span>
    `;

    toastContainer.appendChild(element);

    // Trigger reflow for animation
    element.offsetHeight;
    element.classList.add('toast--visible');

    setTimeout(() => {
        element.classList.remove('toast--visible');
        element.classList.add('toast--hiding');

        setTimeout(() => {
            element.remove();
            isProcessing = false;
            processQueue();
        }, 300);
    }, toast.duration);
}

/**
 * Show success toast
 * @param {string} message - Message
 */
function success(message) {
    show(message, 'success');
}

/**
 * Show error toast
 * @param {string} message - Message
 */
function error(message) {
    show(message, 'error');
}

/**
 * Show warning toast
 * @param {string} message - Message
 */
function warning(message) {
    show(message, 'warning');
}

/**
 * Show info toast
 * @param {string} message - Message
 */
function info(message) {
    show(message, 'info');
}

/**
 * Clear all toasts
 */
function clearAll() {
    if (toastContainer) {
        toastContainer.innerHTML = '';
    }
    toastQueue = [];
    isProcessing = false;
}

export {
    init,
    show,
    success,
    error,
    warning,
    info,
    clearAll
};
