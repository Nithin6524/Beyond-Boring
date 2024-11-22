async function setBackground() {
    try {
        let { url } = await chrome.storage.local.get("url");

        // If no URL is found, set a default background
        if (!url) {
            url =
                "https://wallpapers-clan.com/wp-content/uploads/2024/10/crimson-sunset-mountain-range-desktop-wallpaper-cover.jpg"; // Default background URL
        }

        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = "cover";
    } catch (error) {
        console.error("Error retrieving background URL:", error);
    }
}

// Get the current background URL from chrome.storage.local
async function getCurrentBackground() {
    try {
        const { url } = await chrome.storage.local.get("url");
        return url || null;
    } catch (error) {
        console.error("Error getting current background:", error);
        return null;
    }
}

// Check if the background URL is in the list of liked backgrounds
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

// Update the like button UI based on whether the background is liked or not
function updateUI(isLiked) {
    const likeButton = document.getElementById("likeButton");

    if (!likeButton) {
        console.error("Like button not found in the DOM");
        return;
    }

    // Update the UI based on the like status
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

// Initialize the background settings and event listeners
async function init() {
    try {
        const backgroundURL = await getCurrentBackground();
        await setBackground(); // Set the background image

        const isLiked = await checkIfLiked(backgroundURL); // Check if the background is liked
        updateUI(isLiked); // Update the UI with the like status

        const likeButton = document.getElementById("likeButton");
        if (likeButton) {
            likeButton.addEventListener("click", () => toggleLike(backgroundURL)); // Add click event to toggle like
        } else {
            console.error("Like button not found in the DOM");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}
// Start the initialization when the page is loaded
init();
