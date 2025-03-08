const API_BASE_URL = "https://proxy-server-o1yd.onrender.com";
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
    const url = `${API_BASE_URL}/api/weather?lat=${latitude}&lon=${longitude}`;
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

