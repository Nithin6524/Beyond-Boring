async function fetchHeadlines() {
    try {
        const response = await fetch(
            `https://proxy-server-o1yd.onrender.com/api/news?category=technology`
        );
        const data = await response.json();
        return data.articles; // Return the articles array
    } catch (error) {
        console.error("Error fetching articles:", error);
        return []; // Return empty array on error
    }
}

const getFavicon = async (url) => {
    const faviconURL = `chrome-extension://amohjdkkamkllkfngoeflabhhpkhcpad/_favicon/?pageUrl=${url}&size=40`;
    return { icon: faviconURL, link: url };
};

async function renderArticles() {
    try {
        const articlesArray = await fetchHeadlines(); // Wait for the data

        const articleList = document.querySelector(".articles");
        articleList.innerHTML = ""; // Clear previous content

        articlesArray.slice(0, 5).forEach(async (article) => {
            const articleElement = document.createElement("li");

            articleElement.innerHTML = `
                <a href="${article.url}" target="_blank" class="article-link">
                    <h3 class="article-title">${article.title}</h3>
                </a>
                <p>${article.description}</p>
            `;
            articleList.appendChild(articleElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

renderArticles(); // Call the function to render articles
