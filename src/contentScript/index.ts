console.log('[contentScript] - Content script loaded');

import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from '../pages/popup';

let popupContainer: HTMLDivElement | null = null;

function createPopupContainer() {
    console.log('[contentScript] #createPopupContainer() - Creating popup container');
    const container = document.createElement('div');
    container.id = 'supernotes-capture-popup';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    return container;
}

function togglePopup() {
    console.log('[contentScript] #togglePopup() - Toggling popup');
    if (popupContainer) {
        console.log('[contentScript] #togglePopup() - Removing popup container');
        document.body.removeChild(popupContainer);
        popupContainer = null;
    } else {
        console.log('[contentScript] #togglePopup() - Creating popup container');
        popupContainer = createPopupContainer();
        document.body.appendChild(popupContainer);
        ReactDOM.createRoot(popupContainer).render(React.createElement(Popup));
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[contentScript] - Received message:', message);
    if (message.action === 'TOGGLE_POPUP') {
        console.log('[contentScript] Received TOGGLE_POPUP message');
        togglePopup();
    }
});
