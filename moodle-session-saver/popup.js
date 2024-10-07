document.addEventListener('DOMContentLoaded', () => {
    console.log("Popup script loaded");  // Add this for testing
    document.getElementById('saveSession').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "saveCookie" });
    });

    document.getElementById('restoreSession').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "restoreCookie" });
    });
});
