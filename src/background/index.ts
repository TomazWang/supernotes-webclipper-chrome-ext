// background/index.ts
import { browser } from 'webextension-polyfill-ts';
import { TOGGLE_POPUP, CREATE_CARD, CREATE_CARD_RESPONSE } from '../common/actions';
import { simpleCreateCard } from '../utils/api';
import { GET_TAB_INFO, GET_TAB_INFO_RESPONSE } from '../common/actions';

console.log('[background] Background script loaded');

async function getTabInfo() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return {
        title: tab.title || '',
        url: tab.url || '',
    };
}

async function getApiKey(): Promise<string | undefined> {
    console.log('[background] Retrieving API key from storage');
    const result = await browser.storage.sync.get('apiKey');
    return result.apiKey;
}

browser.runtime.onInstalled.addListener(() => {
    console.log('[background] - Extension installed');
});

browser.action.onClicked.addListener((tab) => {
    console.log('[background] - Action clicked', tab);
    if (tab.id) {
        console.log('[background] - Sending TOGGLE_POPUP message to tab', tab.id);
        chrome.tabs.sendMessage(tab.id, { action: TOGGLE_POPUP }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('[background] - Error sending message:', JSON.stringify(chrome.runtime.lastError));
            } else {
                console.log('[background] - Message sent successfully', response);
            }
        });
    }
});

browser.runtime.onMessage.addListener(async (request) => {
    console.log('[background] Received message', request);

    if (request.action === GET_TAB_INFO) {
        const tabInfo = await getTabInfo();
        return { action: GET_TAB_INFO_RESPONSE, ...tabInfo };
    } else if (request.action === CREATE_CARD) {
        console.log('[background] CREATE_CARD, creating Supernotes card');
        try {
            const apiKey = await getApiKey();
            if (!apiKey) {
                throw new Error('API key not found. Please set it in the extension options.');
            }
            const result = await simpleCreateCard(apiKey, request.data);
            console.log('[background] Supernotes card created successfully', result);
            return { action: CREATE_CARD_RESPONSE, result: { success: true, message: 'Card created successfully!' } };
        } catch (error) {
            console.error('[background] Failed to create Supernotes card', error);
            const errorMessage = (error as Error).message;
            return { action: CREATE_CARD_RESPONSE, result: { success: false, message: errorMessage } };
        }
    }
});
