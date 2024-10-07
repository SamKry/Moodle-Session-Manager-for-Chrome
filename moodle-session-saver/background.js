chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background.js:", message);  // Debugging the message
    if (message.action === "saveCookie") {
        console.log("Save action triggered");
        saveMoodleSessionCookie();
    } else if (message.action === "restoreCookie") {
        console.log("Restore action triggered");
        restoreMoodleSessionCookie();
    }
});

function saveMoodleSessionCookie() {
    console.log("Attempting to save MoodleSession cookie...");
    chrome.cookies.get({ url: 'https://moodle.zhaw.ch', name: "MoodleSession" }, (cookie) => {
        if (cookie) {
            console.log("Cookie found:", cookie);
            // Use chrome.storage.local to save the cookie
            chrome.storage.local.set({ MoodleSession: JSON.stringify(cookie) }, () => {
                console.log("Moodle session cookie saved.");
            });
        } else {
            console.log("No MoodleSession cookie found.");
        }
    });
}

function restoreMoodleSessionCookie() {
    console.log("Attempting to restore MoodleSession cookie...");
    chrome.storage.local.get("MoodleSession", (result) => {
        const savedCookie = result.MoodleSession;
        if (savedCookie) {
            console.log("Saved cookie found:", savedCookie);
            const cookieData = JSON.parse(savedCookie);

            // Remove the existing cookie if it exists
            chrome.cookies.remove({
                url: 'https://moodle.zhaw.ch',
                name: cookieData.name
            }, (details) => {
                if (chrome.runtime.lastError) {
                    console.error("Error removing cookie:", chrome.runtime.lastError);
                } else {
                    console.log("Old Moodle session cookie removed:", details);
                    
                    // Now set the new cookie
                    chrome.cookies.set({
                        url: 'https://moodle.zhaw.ch',
                        name: cookieData.name,
                        value: cookieData.value,
                        domain: cookieData.domain,
                        path: cookieData.path,
                        secure: cookieData.secure,
                        httpOnly: cookieData.httpOnly,
                        expirationDate: cookieData.expirationDate
                    }, (setCookie) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error setting cookie:", chrome.runtime.lastError);
                        } else {
                            console.log("Moodle session cookie restored:", setCookie);
                            
                            // Refresh the current active tab
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                chrome.tabs.reload(tabs[0].id, { bypassCache: true }, () => {
                                    console.log("Page reloaded after restoring cookie.");
                                });
                            });
                        }
                    });
                }
            });
        } else {
            console.log("No saved MoodleSession cookie found.");
        }
    });
}
