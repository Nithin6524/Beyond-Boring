chrome.runtime.onMessage.addListener((message, sender) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {
        // console.log(message.type);
        if (message.type === "open_side_panel") {
            try {
                // Open a tab-specific side panel only on the current tab.
                await chrome.sidePanel.open({ tabId: sender.tab.id });
                await chrome.sidePanel.setOptions({
                    tabId: sender.tab.id,
                    path: "sidepanel.html",
                    enabled: true,
                });
            } catch (error) {
                console.error("Failed to open side panel:", error);
            }
        }
    })();
});

// storage.js
console.log("storage");
function savePlaylists(playlists) {
    chrome.storage.sync.set({ playlists }, () => {
        console.log("Playlists saved:", playlists);
    });
}

function getPlaylists(callback) {
    chrome.storage.sync.get("playlists", (result) => {
        const playlists = result.playlists || [];
        console.log("Retrieved playlists:", playlists);
        callback(playlists);
    });
}

// Example usage to test the functions
// Save some test playlists
const testPlaylists = ["My Playlist 1", "My Playlist 2"];
savePlaylists(testPlaylists);

// Retrieve playlists
getPlaylists((playlists) => {
    console.log("Playlists in callback:", playlists);
});
