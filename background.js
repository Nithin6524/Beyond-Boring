chrome.runtime.onMessage.addListener((message, sender) => {
    (async () => {
        if (message.type === "open_side_panel") {
            try {
                await chrome.sidePanel.open({ tabId: sender.tab.id });
                await chrome.sidePanel.setOptions({
                    tabId: sender.tab.id,
                    path: "spotify-panel.html",
                    enabled: true,
                });
            } catch (error) {
                console.error("Failed to open side panel:", error);
            }
        }
    })();
});


chrome.storage.sync.get(["likedBackgrounds", "customBackgrounds"], (result) => {
    if (!result.likedBackgrounds) {
        chrome.storage.sync.set({ likedBackgrounds: [] });
    }
    if (!result.customBackgrounds) {
        chrome.storage.sync.set({ customBackgrounds: [] });
    }
});

async function getBackgroundURL() {
    const { customBackgrounds = [], likedBackgrounds = [] } = await chrome.storage.sync.get([
        "customBackgrounds",
        "likedBackgrounds",
    ]);

    let {
        customIndex = 0,
        likedIndex = 0,
        predefinedIndex = 0,
    } = await chrome.storage.sync.get(["customIndex", "likedIndex", "predefinedIndex"]);

    const predefinedBackgrounds = [
        "https://wallpaperaccess.com/thumb/642857.png",
        "https://c4.wallpaperflare.com/wallpaper/861/924/6/monica-bellucci-1280x1024-people-hot-girls-hd-art-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/800/164/994/monica-bellucci-celebrity-hd-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/564/791/583/actresses-monica-bellucci-wallpaper-preview.jpg",
        "https://wallpapers-clan.com/wp-content/uploads/2024/11/ghost-in-the-shell-motoko-kusanagi-desktop-wallpaper-cover.jpg",
        "https://wallpapers-clan.com/wp-content/uploads/2024/10/crimson-sunset-mountain-range-desktop-wallpaper-cover.jpg",
        "https://wallpapers-clan.com/wp-content/uploads/2024/05/alien-red-planet-scenery-desktop-wallpaper-cover.jpg",
        "https://wallpapers-clan.com/wp-content/uploads/2024/11/hogwarts-student-magic-potion-class-desktop-wallpaper-cover.jpg"
    ];

    const hasEnoughCustoms = customBackgrounds.length >= 3;
    const hasEnoughLikes = likedBackgrounds.length >= 3;

    const getNextBackground = () => {
        if (hasEnoughCustoms) {
            const background = customBackgrounds[customIndex % customBackgrounds.length];
            customIndex = (customIndex + 1) % customBackgrounds.length;
            chrome.storage.sync.set({ customIndex });
            return background;
        } else if (hasEnoughLikes) {
            const background = likedBackgrounds[likedIndex % likedBackgrounds.length];
            likedIndex = (likedIndex + 1) % likedBackgrounds.length;
            chrome.storage.sync.set({ likedIndex });
            return background;
        } else {
            const background =
                predefinedBackgrounds[predefinedIndex % predefinedBackgrounds.length];
            predefinedIndex = (predefinedIndex + 1) % predefinedBackgrounds.length;
            chrome.storage.sync.set({ predefinedIndex });
            return background;
        }
    };

    const blendBackgrounds = [
        ...customBackgrounds,
        ...likedBackgrounds,
        ...predefinedBackgrounds,
    ].filter((url, index, self) => self.indexOf(url) === index);

    const background =
        hasEnoughCustoms || hasEnoughLikes
            ? getNextBackground()
            : blendBackgrounds[
                  (customIndex + likedIndex + predefinedIndex) % blendBackgrounds.length
              ];

    if (!hasEnoughCustoms && !hasEnoughLikes) {
        predefinedIndex++;
        chrome.storage.sync.set({ predefinedIndex });
    }

    return background;
}

chrome.tabs.onCreated.addListener(async (tab) => {
    const backgroundURL = await getBackgroundURL();
    chrome.storage.local.set({ url: `${backgroundURL}` });
    console.log(`backgroundURL: ${backgroundURL}`);
});
