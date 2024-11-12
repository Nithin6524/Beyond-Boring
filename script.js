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
        updateWeatherUI(data);
    } catch (error) {
        console.error(error.message);
    }
}

function updateWeatherUI(data) {
    const weatherMap = {
        ".location": data.name,
        ".temperature": `${data.main.temp}°C`,
        ".wind": `Wind: ${data.wind.speed} m/s`,
        ".description": data.weather[0].description,
    };

    Object.entries(weatherMap).forEach(([selector, content]) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = content;
    });

    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

fetchWeather();

window.onload = async () => {
    const mostVisitedURLs = await chrome.topSites.get();
    const mostVisitedDiv = document.querySelector(".mostVisited");

    const uniqueUrls = new Set();

    const getFavicon = async (url) => {
        const domain = new URL(url).hostname;
        const parsedUrl = new URL(url);
        const faviconURL = `https://www.faviconextractor.com/favicon/${domain}`;
        try {
            const img = new Image();
            img.src = faviconURL;
            await img.decode();
            return { icon: faviconURL, link: parsedUrl.origin };
        } catch {
            return null;
        }
    };

    for (const obj of mostVisitedURLs) {
        if (uniqueUrls.size >= 5) break;
        const siteData = await getFavicon(obj.url);
        if (siteData && !uniqueUrls.has(siteData.link)) {
            uniqueUrls.add(siteData.link);
            createSiteLink(siteData);
        }
    }

    function createSiteLink({ icon, link }) {
        const SiteLinkEle = document.createElement("a");
        const linksDiv = document.createElement("div");
        SiteLinkEle.target = "_blank";
        SiteLinkEle.href = link;

        const ImageElement = document.createElement("img");
        ImageElement.classList.add("site-image");
        ImageElement.src = icon;
        SiteLinkEle.appendChild(ImageElement);
        linksDiv.appendChild(SiteLinkEle);
        mostVisitedDiv.appendChild(linksDiv);
    }

    const searchInput = document.getElementById("myInput");
    function simulateEnterKeyPress() {
        const event = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            which: 13,
            keyCode: 13,
            bubbles: true,
            cancelable: true,
        });

        searchInput.dispatchEvent(event);
    }

    // Adding an event listener to check if it triggers a search
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                chrome.runtime.sendMessage({ type: "search", query: query });
            } else {
            }
        }
    });

    // Trigger the function to simulate the Enter key (for testing)
    simulateEnterKeyPress();
};

document.querySelector(".playlist-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "open_side_panel" });
});

const clockSelectors = {
    hours: document.querySelector(".hours"),
    minutes: document.querySelector(".minutes"),
    date: document.querySelector(".date"),
    monthYear: document.querySelector(".month-year"),
    day: document.querySelector(".day"),
};

function updateClock() {
    const currentTime = moment();

    clockSelectors.hours.textContent = currentTime.format("HH");
    clockSelectors.minutes.textContent = currentTime.format("mm");
    clockSelectors.date.textContent = currentTime.format("DD");
    clockSelectors.monthYear.textContent = currentTime.format("MMMM YYYY");
    clockSelectors.day.textContent = currentTime.format("dddd");
}

setInterval(updateClock, 1000);

updateClock();
