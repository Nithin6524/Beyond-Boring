async function renderQuote() {
    const response = await fetch(
        "https://proxy-server-o1yd.onrender.com/api/quote"
    );
    const quoteData = await response.json();
    const quoteElement = document.querySelector(".quote");
    quoteElement.textContent = quoteData.quote;
    const authorElement = document.createElement("p");
    authorElement.classList.add("author");

    authorElement.textContent = "-  " + quoteData.author;

    quoteElement.appendChild(authorElement);
}

renderQuote();
