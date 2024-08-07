// contentScript/index.ts

import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from '../pages/popup';

let popupContainer: HTMLIFrameElement | null = null;

function createPopupContainer() {
    console.log('[contentScript] #createPopupContainer() - Creating popup container');
    const iframe = document.createElement('iframe');
    iframe.id = 'supernotes-capture-popup-container';
    iframe.style.position = 'fixed';
    iframe.style.top = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '375px';
    iframe.style.height = '500px'; // Adjust as needed
    iframe.style.border = 'none';
    iframe.style.zIndex = '2147483647'; // Max z-index value
    return iframe;
}

async function injectTailwindStyles(doc: Document) {
    const response = await fetch(chrome.runtime.getURL('tailwind.css'));
    const css = await response.text();
    const style = doc.createElement('style');
    style.textContent = css;
    doc.head.appendChild(style);
}

async function injectPopup(iframe: HTMLIFrameElement) {
    const doc = iframe.contentDocument;
    if (doc) {
        const root = doc.createElement('div');
        root.id = 'root';
        doc.body.appendChild(root);

        // Inject Tailwind styles
        await injectTailwindStyles(doc);

        // Inject styles
        const style = doc.createElement('style');
        style.textContent = `
            body { margin: 0; font-family: Arial, sans-serif; }
            #root { width: 100%; height: 100%; }
        `;
        doc.head.appendChild(style);

        // Render React app
        ReactDOM.createRoot(root).render(React.createElement(Popup));
    }
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
        injectPopup(popupContainer);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[contentScript] - Received message:', message);
    if (message.action === 'TOGGLE_POPUP') {
        console.log('[contentScript] Received TOGGLE_POPUP message');
        togglePopup();
    }
});

// Forward messages from background to iframe
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (popupContainer && popupContainer.contentWindow) {
        popupContainer.contentWindow.postMessage(message, '*');
    }
});
