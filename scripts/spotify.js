document.querySelector(".c-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission refresh

    const inputField = document.querySelector(".c-form__input");
    const spotifyUrl = inputField.value.trim();

    // Regular expression to validate Spotify playlist URLs
    const spotifyRegex =
        /^(https?:\/\/)?open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?.*)?$/;

    // Check if the URL is a valid Spotify playlist
    const match = spotifyUrl.match(spotifyRegex);
    if (!match) {
        alert("Please enter a valid Spotify playlist URL.");
        return;
    }

    const playlistId = match[2]; // Extract the playlist ID
    console.log(playlistId);
    // Create a sanitized iframe element
    localStorage.setItem("selectedPlaylist", playlistId);
    // Clear previous content and embed the new playlist
    const container = document.querySelector(".spotify");
    container.innerHTML = "";
    container.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0" kframeBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    container.appendChild(iframe);
});

function initializeSpotify() {
    const savedPlaylistId = localStorage.getItem("selectedPlaylist");
    if (savedPlaylistId) {
        const container = document.querySelector(".spotify");
        container.innerHTML = ""; // Clear previous iframes
        const iframe = document.createElement("iframe");
        iframe.style.borderRadius = "12px";
        iframe.src = `https://open.spotify.com/embed/playlist/${savedPlaylistId}?utm_source=generator&theme=0`;
        iframe.allowFullscreen = true;
        iframe.allow =
            "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        iframe.loading = "lazy";
        container.appendChild(iframe);
        const changeButton = document.createElement("button");
        changeButton.classList.add("change-button");
        changeButton.textContent = "⋮";
        changeButton.addEventListener("click", () => {
            localStorage.removeItem("selectedPlaylist");
            location.reload();
        });

        document.querySelector(".spotify").appendChild(changeButton);
    }
}

initializeSpotify();
