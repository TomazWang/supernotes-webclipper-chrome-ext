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
