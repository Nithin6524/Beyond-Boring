async function fetchLocation() {
    try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchWeather() {
    const data = await fetchLocation();
    const latitude = Number(data.lat.toFixed(2));
    const longitude = Number(data.lon.toFixed(2));
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=85f0c87fa86141b8fc3fca0196b56548&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
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

    const getFavicon = async (url) => {
        const faviconURL = `chrome-extension://kjjpomaecmblifgokolpheafiaoblclg/_favicon/?pageUrl=${url}&size=40`;
        try {
            return { icon: faviconURL, link: url };
        } catch (error) {
            console.error("Favicon fetch error:", error);
            return null;
        }
    };

    const promises = mostVisitedURLs.map(async (obj) => {
        return await getFavicon(obj.url);
    });

    const siteDataList = await Promise.all(promises);
    siteDataList.forEach((siteData) => {
        if (siteData) {
            createSiteLink(siteData);
        }
    });

    function createSiteLink({ icon, link }) {
        const SiteLinkEle = document.createElement("a");
        const linksDiv = document.createElement("div");
        SiteLinkEle.target = "_self";
        SiteLinkEle.href = link;
        const ImageElement = document.createElement("img");
        ImageElement.classList.add("site-image");
        ImageElement.src = icon;
        SiteLinkEle.appendChild(ImageElement);
        linksDiv.appendChild(SiteLinkEle);
        mostVisitedDiv.appendChild(linksDiv);
    }

    const searchInput = document.getElementById("myInput");
    
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                chrome.tabs.update({ url: searchUrl });
            }
        }
    });
};

document.querySelector(".playlist-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "open_side_panel" });
});

// Clock updating
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
