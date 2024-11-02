// script.js

const lat = 12.971599;
const long = 77.594566;

async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=85f0c87fa86141b8fc3fca0196b56548&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        updateWeatherUI(data); // Call the function to update UI with fetched data
    } catch (error) {
        console.error(error.message);
    }
}

async function updateWeatherUI(data) {
    // Update the UI elements directly from the fetched data
    document.querySelector(".location").textContent = data.name; // Location name
    document.querySelector(
        ".weather-icon"
    ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // Weather icon URL
    document.querySelector(".temperature").textContent = `${data.main.temp}°C`; // Temperature
    document.querySelector(".wind").textContent = `wind: ${data.wind.speed} m/s`; // Wind speed
    document.querySelector(".description").textContent = data.weather[0].description;
}

// Call the fetchWeather function to initiate the process
fetchWeather();



window.onload = async () => {
    const mostVisitedURLs = await chrome.topSites.get();
    const mostVisitedDiv = document.querySelector(".mostVisited");

    // Limit to top 6 favicons with a Set to avoid duplicates
    const urlSet = new Set();

    // Helper function to check if a favicon exists
    const checkFavicon = (faviconURL) => {
        return new Promise((resolve) => {
            const image = new Image();

            image.onload = function () {
                if (this.width > 0) {
                    urlSet.add(faviconURL);
                    console.log(`Favicon added: ${faviconURL}`);
                }
                resolve(); // Resolve the promise when done
            };

            image.onerror = function () {
                console.log(`Favicon does not exist or failed to load: ${faviconURL}`);
                resolve(); // Resolve even if the image failed to load
            };

            image.src = faviconURL;
        });
    };

    // Create an array of promises to check each URL
    const faviconPromises = mostVisitedURLs.map((obj) => {
        const domain = obj.url.replace(/.+\/\/|www.|\..+/g, "");
        const faviconURL = `https://www.${domain}.com/favicon.ico`;
        return checkFavicon(faviconURL);
    });

    // Wait for all favicon checks to complete
    await Promise.all(faviconPromises);

    // Render only the top 6 favicons in `urlSet`
    Array.from(urlSet).slice(0, 6).forEach((ImageSrc) => {
        const ImageElement = document.createElement("img");
        ImageElement.classList.add("site-image");
        ImageElement.src = ImageSrc;
        mostVisitedDiv.appendChild(ImageElement);
    });
};


document.getElementById('search-button').addEventListener('click', function() {
    const searchQuery = document.getElementById('search-input').value;
    const videoId = extractVideoID(searchQuery); // Define this function to extract ID from the input

    if (videoId) {
        document.getElementById('youtube-iframe').src = `https://www.youtube.com/embed/${videoId}`;
    } else {
        alert('Invalid YouTube video link or ID');
    }
});

function extractVideoID(url) {
    // Example of extracting video ID from a URL
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}