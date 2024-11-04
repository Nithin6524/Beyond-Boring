document.getElementById('search-button').addEventListener('click', function() {
    const searchQuery = document.getElementById('search-input').value; // Get the user input
    const videoId = extractVideoID(searchQuery); // Extract the video ID

    if (videoId) {
        playVideo(videoId); // If valid, play the video
    } else {
        alert(`Invalid YouTube video link or ID ${videoId}`); // Alert for invalid input
    }
});

// Function to extract video ID from a YouTube URL
function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null; // Return the video ID if matched
}

// Function to play the video by setting the iframe source
function playVideo(videoId) {
    const iframe = document.getElementById('youtube-iframe');
    const overlay = document.getElementById('overlay');

    // Set the iframe src to embed the YouTube video
    iframe.src = `https://www.youtube.com/embed/${videoId}?&autoplay=1`;
    overlay.style.display = 'none'; // Hide overlay when playing a new video
}
