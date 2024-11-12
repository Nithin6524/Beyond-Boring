document.getElementById("search-button").addEventListener("click", function () {
    const searchQuery = document.getElementById("search-input").value; // Get the user input
    const videoId = extractVideoID(searchQuery);
    console.log(videoId);
    if (videoId) {
        playVideo(videoId); 
    } else {
        chrome.tabs.update({url:`https://www.youtube.com/results?search_query=${searchQuery}`});
    }
});

function extractVideoID(url) {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function playVideo(videoId) {
    const player = document.getElementById("player");
    player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com?&autoplay=1`;
}
