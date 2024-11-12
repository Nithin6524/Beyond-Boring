async function setBackground() {
    try {
        const { url } = await chrome.storage.local.get("url");
        if (url) {
            document.body.style.backgroundImage = `url(${url})`;
            document.body.style.backgroundSize = "cover";
        } else {
            console.error("No background URL found in storage");
        }
    } catch (error) {
        console.error("Error retrieving background URL:", error);
    }
}
async function getCurrentBackground() {
    try {
        const { url } = await chrome.storage.local.get("url");

        return url || null;
    } catch (error) {
        console.error("Error getting current background:", error);
        return null;
    }
}

async function checkIfLiked(backgroundURL) {
    try {
        const { likedBackgrounds = [] } = await chrome.storage.sync.get("likedBackgrounds");
        return likedBackgrounds.includes(backgroundURL);
    } catch (error) {
        console.error("Error checking liked backgrounds:", error);
        return false;
    }
}

async function toggleLike(backgroundURL) {
    if (!backgroundURL) {
        console.error("No background URL set.");
        return;
    }

    try {
        const { likedBackgrounds = [] } = await chrome.storage.sync.get("likedBackgrounds");
        const isLiked = likedBackgrounds.includes(backgroundURL);

        if (isLiked) {
            const updatedLikedBackgrounds = likedBackgrounds.filter((bg) => bg !== backgroundURL);
            await chrome.storage.sync.set({ likedBackgrounds: updatedLikedBackgrounds });
            updateUI(false);
        } else {
            likedBackgrounds.push(backgroundURL);
            await chrome.storage.sync.set({ likedBackgrounds });
            updateUI(true);
        }
    } catch (error) {
        console.error("Error toggling like status:", error);
    }
}

function updateUI(isLiked) {
    const likeButton = document.getElementById("likeButton");

    if (isLiked) {
        likeButton.classList.add("liked");
        likeButton.classList.remove("unliked");
        document.querySelector(".tooltip").innerHTML = "Unlike the background";
    } else {
        likeButton.classList.remove("liked");
        likeButton.classList.add("unliked");

        document.querySelector(".tooltip").innerHTML = "Like the background";
    }
}

async function init() {
    try {
        const backgroundURL = await getCurrentBackground();

        await setBackground();

        const isLiked = await checkIfLiked(backgroundURL);
        updateUI(isLiked);

        const likeButton = document.getElementById("likeButton");
        likeButton.addEventListener("click", () => toggleLike(backgroundURL));
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

init();
