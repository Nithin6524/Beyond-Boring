const clockSelectors = {
    hours: document.querySelector(".hours"),
    minutes: document.querySelector(".minutes"),
    date: document.querySelector(".date"),
    month: document.querySelector(".month"),
    year: document.querySelector(".year"),
    day: document.querySelector(".day"),
};

function updateClock() {
    const currentTime = moment();

    clockSelectors.hours.textContent = currentTime.format("HH");
    clockSelectors.minutes.textContent = currentTime.format("mm");
    clockSelectors.date.textContent = currentTime.format("DD");
    clockSelectors.month.textContent = currentTime.format("MMMM");
    clockSelectors.year.textContent = currentTime.format("YYYY");
    clockSelectors.day.textContent = currentTime.format("dddd");
}

async function renderQuote() {
    const response = await fetch("http://localhost:3000/api/quote");
    const quoteData = await response.json();
    const quoteElement = document.querySelector(".quote");
    quoteElement.textContent = quoteData.quote;
    const authorElement = document.createElement("p");
    authorElement.classList.add("author");

    authorElement.textContent = '-  '+ quoteData.author;

    quoteElement.appendChild(authorElement);
}

renderQuote();
setInterval(updateClock, 1000);
updateClock();
