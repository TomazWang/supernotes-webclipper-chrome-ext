// contentScript/index.ts

import { browser, Runtime } from 'webextension-polyfill-ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from '../pages/popup';
import {
    GET_TAB_INFO,
    GET_TAB_INFO_RESPONSE,
    TOGGLE_POPUP,
    CAPTURE_TAB,
    CAPTURE_TAB_RESPONSE,
    CREATE_CARD,
    CREATE_CARD_RESPONSE,
    CLOSE_POPUP,
} from '../common/actions';
import { Message, Response } from '../common/messageTypes';

console.log('[contentScript] Content script loaded');

let popupContainer: HTMLIFrameElement | null = null;

// ------------------------------------------------------------------------------
// ## Popup - Create a popup iframe
// ------------------------------------------------------------------------------

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
    console.log('[contentScript] #injectPopup() - Injecting popup into iframe');
    const doc = iframe.contentDocument;
    if (doc) {
        const root = doc.createElement('div');
        root.id = 'root';
        console.log('[contentScript] #injectPopup() - Appending root to document');
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
        console.log('[contentScript] #injectPopup() - Rendering React app');
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

function forceClosePopup() {
    console.log('[contentScript] #forceClosePopup() - Closing popup forcefully');
    if (popupContainer) {
        console.log('[contentScript] #forceClosePopup() - Removing popup container');
        document.body.removeChild(popupContainer);
        popupContainer = null;
    } else {
        console.log('[contentScript] #forceClosePopup() - Popup container not found');
    }
}

function sendMessageToPopup(message: { action: string; [key: string]: unknown }) {
    console.log(`[contentScript] #sendMessageToPopup() - Sending message to popup, action = ${message.action}`, message);
    if (popupContainer && popupContainer.contentWindow) {
        popupContainer.contentWindow.parent.postMessage(message, '*');
    } else {
        console.warn('[contentScript] #sendMessageToPopup() - Popup container not found');
    }
}

// ------------------------------------------------------------------------------
// ## Get tab data
// ------------------------------------------------------------------------------

async function getTabData(): Promise<{ title: string; url: string; description: string }> {
    console.log('[contentScript] #getTabData - Getting tab data');
    const response = await browser.runtime.sendMessage({ action: GET_TAB_INFO });
    const { title, url } = response;
    const description = getMetaDescription();
    return { title, url, description };
}

function getMetaDescription(): string {
    const metaTags = ['description', 'og:description', 'twitter:description'];

    for (const tag of metaTags) {
        const metaTag = document.querySelector(`meta[name="${tag}"], meta[property="${tag}"]`);
        if (metaTag) {
            const content = metaTag.getAttribute('content');
            if (content) return content;
        }
    }

    return '';
}

function createCardMarkup(data: { title: string; url: string; description: string; notes: string; tags: string[] }): {
    name: string;
    markup: string;
    tags: string[];
} {
    console.log('[contentScript] #createCardMarkup - Creating card markup', data);
    const cardContent = `
${data.url}
> ${data.description}

${data.notes}`;

    const cardTitle = `Web Clip - ${data.title}`;
    const tags = [...data.tags, '__clip'];

    return {
        name: cardTitle,
        markup: cardContent,
        tags: tags,
    };
}

// ------------------------------------------------------------------------------
// Closing the popup
// ------------------------------------------------------------------------------
function closePopupWithAnimation() {
    console.log('[contentScript] #closePopupWithAnimation() - Closing popup with animation');
    if (popupContainer) {
        popupContainer.style.transition = 'opacity 300ms ease-out';
        popupContainer.style.opacity = '0';
        setTimeout(() => {
            forceClosePopup();
        }, 300);
    } else {
        console.log('[contentScript] #closePopupWithAnimation() - Popup container not found');
    }
}

// browser messages
// ==============================

// Forward messages from popup to background
window.addEventListener('message', async (event) => {
    console.log(`[contentScript]# - Received message from popup, action = ${event.data.action}`, event.data);
    if (event.data.action === GET_TAB_INFO) {
        // get preview info from current tab
        const tabData = await getTabData();
        sendMessageToPopup({ action: GET_TAB_INFO_RESPONSE, ...tabData });
    } else if (event.data.action === CAPTURE_TAB) {
        // create card and save to Supernotes
        const cardData = createCardMarkup(event.data.data);
        const response = await browser.runtime.sendMessage({ action: CREATE_CARD, data: cardData });
        console.log('[contentScript] Received CREATE_CARD_RESPONSE', response);
        sendMessageToPopup({ action: CAPTURE_TAB_RESPONSE, result: response.result });
    } else if (event.data.action === CLOSE_POPUP) {
        closePopupWithAnimation();
    }
});

// Forward messages from background to iframe
browser.runtime.onMessage.addListener(async (message: Message): Promise<Response> => {
    console.log(`[contentScript] Received message from background, action = ${message.action}`, message);

    switch (message.action) {
        case TOGGLE_POPUP:
            togglePopup();
            return { success: 'TOGGLE_POPUP_SUCCESS' };
        case CREATE_CARD_RESPONSE:
            sendMessageToPopup({ action: CAPTURE_TAB_RESPONSE, result: message.result });
            return;
        default:
            console.warn('[contentScript] Unhandled message action:', message.action);
            return;
    }
});
