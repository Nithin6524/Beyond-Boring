// document.getElementById("add-playlist-btn").addEventListener("click", addPlaylist);

function addPlaylist() {
    const playlistName = document.getElementById("new-playlist-name").value.trim();
    if (!playlistName) return; // Ignore empty input

    // Create a new playlist item
    const playlistItem = document.createElement("li");
    playlistItem.textContent = playlistName;
    playlistItem.addEventListener("click", () => selectPlaylist(playlistName));

    const optionsButton = document.createElement("button");
    optionsButton.textContent = "⋮";
    optionsButton.classList.add("options-btn");
    playlistItem.appendChild(optionsButton);

    document.getElementById("playlist-list").appendChild(playlistItem);

    // Clear the input
    document.getElementById("new-playlist-name").value = "";
}

function selectPlaylist(playlistName) {
    document.getElementById("selected-playlist-name").textContent = `${playlistName} - Videos`;
    // Reset video list and add-video input as needed for the selected playlist
}

// document.getElementById("add-video-btn").addEventListener("click", addVideo);

function addVideo() {
    const videoTitle = document.getElementById("video-title").value.trim();
    const videoUrl = document.getElementById("video-url").value.trim();
    if (!videoTitle || !videoUrl) return; // Ignore empty inputs

    // Create a new video item
    const videoItem = document.createElement("li");
    videoItem.textContent = `${videoTitle}: ${videoUrl}`;

    document.getElementById("video-list").appendChild(videoItem);

    // Clear inputs
    document.getElementById("video-title").value = "";
    document.getElementById("video-url").value = "";
}

