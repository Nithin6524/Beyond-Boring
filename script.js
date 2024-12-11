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
    const mostVisitedDiv = document.querySelector(".mostVisited");
    const importantDiv = document.querySelector(".important");


    const getFavicon = async (url) => {
        const faviconURL = `chrome-extension://cniiooklficmmkaapfeopjmoigbnjjpa/_favicon/?pageUrl=${url}&size=48`;
        return { icon: faviconURL, link: url };
    };

    const createSiteLink = ({ icon, link }, targetDiv, deleteCallback = null) => {
        console.log(`Creating site link for: ${link}`);
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container");
        

        const siteLink = document.createElement("a");
        siteLink.target = "_blank";
        siteLink.href = link;

        const imgElement = document.createElement("img");
        imgElement.classList.add("site-image");
        imgElement.src = icon;
        imgElement.alt = `Favicon for ${new URL(link).hostname}`;
        siteLink.appendChild(imgElement);

        if (deleteCallback) {
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "×";
            deleteButton.title = "Delete this URL";
            deleteButton.onclick = () => {
                console.log(`Deleting site: ${link}`);
                linkContainer.remove();
                deleteCallback(link);
            };
            linkContainer.appendChild(deleteButton);
        }
        linkContainer.appendChild(siteLink);
        targetDiv.appendChild(linkContainer);
    };

    const loadImportantSites = async () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(["importantSites"], (result) => {
                console.log("Loaded important sites:", result.importantSites || []);
                resolve(result.importantSites || []);
            });
        });
    };

    const saveImportantSites = async (sites) => {
        return new Promise((resolve) => {
            console.log("Saving important sites:", sites);
            chrome.storage.sync.set({ importantSites: sites }, resolve);
        });
    };

    const renderStoredSites = async () => {
        const storedSites = await loadImportantSites();
        storedSites.forEach((siteData) => {
            createSiteLink(siteData, importantDiv, async (linkToDelete) => {
                const updatedSites = storedSites.filter((site) => site.link !== linkToDelete);
                await saveImportantSites(updatedSites);
            });
        });
    };

    const initializeMostVisited = async () => {
        try {
            const mostVisitedURLs = await chrome.topSites.get();
            console.log("Most visited URLs:", mostVisitedURLs);

            const promises = mostVisitedURLs.map(async (obj) => await getFavicon(obj.url));
            const siteDataList = await Promise.all(promises);

            siteDataList.slice(0, 10).forEach((siteData) => {
                if (siteData) {
                    createSiteLink(siteData, mostVisitedDiv); // No deleteCallback for most visited
                }
            });
        } catch (error) {
            console.error("Error fetching most visited sites:", error);
        }
    };

    document.getElementById("add-site").addEventListener("click", async () => {
        console.log("Add Site button clicked!");

        const urlInput = prompt("Paste the URL here!!");
        if (!urlInput) {
            alert("URL cannot be empty!");
            return;
        }

        let url;
        try {
            url = new URL(urlInput);
            console.log("Parsed URL:", url.href);
        } catch (error) {
            alert("Invalid URL. Please enter a valid one!");
            return;
        }

        const faviconObj = await getFavicon(url.href);
        if (!faviconObj || !faviconObj.icon) {
            alert("Failed to fetch favicon for this URL.");
            return;
        }

        const storedSites = await loadImportantSites();
        storedSites.push(faviconObj);
        await saveImportantSites(storedSites);
        createSiteLink(faviconObj, importantDiv, async (linkToDelete) => {
            const updatedSites = storedSites.filter((site) => site.link !== linkToDelete);
            await saveImportantSites(updatedSites);
        });
    });

    console.log("Rendering stored sites...");
    await renderStoredSites();

    console.log("Initializing most visited...");
    await initializeMostVisited();

    console.log("Setup complete!");
};



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
