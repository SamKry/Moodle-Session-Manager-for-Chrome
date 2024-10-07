function isUserLoggedIn() {
    // Check if the Moodle user menu is present (logged in)
    return document.querySelector('.userbutton') !== null;
}

window.addEventListener("load", function() {
    if (isUserLoggedIn()) {
        chrome.runtime.sendMessage({ action: "saveCookie" });
        console.log("User is logged in. Moodle session cookie saved.");
    } else {
        console.log("User is not logged in. Cookie not saved.");
    }
});
