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
                    // console.log(`Favicon added: ${faviconURL}`);
                }
                resolve(); // Resolve the promise when done
            };

            image.onerror = function () {
                console.log(`Favicon does not exist or failed to load: ${faviconURL}`);
                resolve(); // Resolve even if the image failed to load
            };

            image.src = faviconURL;
            // image.setAttribute("crossorigin", "anonymous");
        });
    };

    console.log(mostVisitedURLs);
    // Create an array of promises to check each URL
    const faviconPromises = mostVisitedURLs.map((obj) => {
        const domain = obj.url.replace(/.+\/\/|www.|\..+/g, "");
        if (domain != "192") {
            const faviconURL = `https://www.${domain}.com/favicon.ico`;
            return checkFavicon(faviconURL);
        }
    });

    // Wait for all favicon checks to complete
    await Promise.all(faviconPromises);

    // Render only the top 6 favicons in `urlSet`
    Array.from(urlSet).forEach((ImageSrc) => {
        const ImageElement = document.createElement("img");
        ImageElement.classList.add("site-image");
        ImageElement.src = ImageSrc;
        mostVisitedDiv.appendChild(ImageElement);
    });
};

document.querySelector(".playlist-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "open_side_panel" });
});

// Ensure the moment library is loaded
if (typeof moment === 'undefined') {
    console.error("Moment.js is not loaded. Make sure the library is included correctly.");
} else {
    console.log("Moment.js loaded successfully.");
}

function updateClock() {
    // Check if the element selectors are correct
    const hoursElement = document.querySelector(".hours");
    const minutesElement = document.querySelector(".minutes");
    const dateElement = document.querySelector(".date");
    const monthYearElement = document.querySelector(".month-year");
    const dayElement = document.querySelector(".day");

    if (!hoursElement || !minutesElement || !dateElement || !monthYearElement || !dayElement) {
        console.error("One or more clock elements are missing. Check your HTML selectors.");
        return;
    }

    // Log the current moment time to confirm it's fetching correctly
    const currentTime = moment();
    console.log("Current Time:", currentTime.format("HH:mm:ss"));

    // Update the clock elements
    hoursElement.textContent = currentTime.format("HH");
    minutesElement.textContent = currentTime.format("mm");
    dateElement.textContent = currentTime.format("DD");
    monthYearElement.textContent = currentTime.format("MMMM YYYY");
    dayElement.textContent = currentTime.format("dddd");

    console.log("Updated Clock: ", {
        hours: hoursElement.textContent,
        minutes: minutesElement.textContent,
        date: dateElement.textContent,
        monthYear: monthYearElement.textContent,
        day: dayElement.textContent
    });
}

// Set an interval to update the clock every second
setInterval(updateClock, 1000);

// Call the function once on load to set initial values
updateClock();

