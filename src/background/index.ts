console.log('[background] - Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('[background] - Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    console.log('[background] - Action clicked', tab);
    if (tab.id) {
        console.log('[background] - Sending TOGGLE_POPUP message to tab', tab.id);
        chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_POPUP' });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[background] - Received message', request);
    if (request.action === 'GET_TAB_INFO' && sender.tab) {
        console.log('[background] - GET_TAB_INFO, sending tab info');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            sendResponse({ title: tab.title, url: tab.url });
        });
        return true; // send a response asynchronously
    }
});
