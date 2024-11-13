document.getElementById("search-button").addEventListener("click", function () {
    const searchQuery = document.getElementById("search-input").value.trim();
    if (searchQuery === "") {
        alert("Please enter a valid search query.");
        return;
    }

    const videoId = extractVideoID(searchQuery);
    console.log(videoId);

    if (videoId) {
        playVideo(videoId);
    } else {
        const sanitizedQuery = encodeURIComponent(searchQuery);
        chrome.tabs.update({
            url: `https://www.youtube.com/results?search_query=${sanitizedQuery}`,
        });
    }
});

function extractVideoID(url) {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);

    if (match) {
        return match[1];
    } else {
        alert("Invalid YouTube URL. Click ok to redirect to youtube search results page.");
        return null;
    }
}

function playVideo(videoId) {
    const player = document.getElementById("player");

    if (!videoId || videoId.length !== 11) {
        alert("Invalid video ID.");
        return;
    }

    const validOrigin = "http://example.com";
    const sanitizedSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${validOrigin}&autoplay=1`;

    player.src = sanitizedSrc;
}
