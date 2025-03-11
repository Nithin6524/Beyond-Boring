async function getBooks(query) {
    try {
        const response = await fetch(
            `https://gnikdroy.pythonanywhere.com/api/book/?search=${query}&languages=en&ordering=-downloads`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.log(error);
    }
}

async function renderBooks(query) {
    try {
        const books = await getBooks(query);
        const bookDiv = document.querySelector(".books");
        const bookList = document.querySelector(".book-list");
        bookDiv.appendChild(bookList);
        if (books.length === 0) {
            const bookElement = document.createElement("li");
            bookElement.innerHTML = `
                    <h2 class="book-title">No books found for ${query}</h2>
            
            `;
            bookList.appendChild(bookElement);
        } else {
            books.slice(0, 5).forEach((book) => {
                const bookElement = document.createElement("li");
                bookElement.innerHTML = `
                <a href="https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}-images.html" target="_blank" id="book-link" class="book-link">
                    <h2 class="book-title">${book.title}</h2>
                </a>
            `;
                bookList.appendChild(bookElement);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Search form submitted");
    const searchInput = document.querySelector("#search-input");
    const query = searchInput.value;

    const bookList = document.querySelector(".book-list");
    const loading = document.createElement("div");
    loading.classList.add("loader");

    bookList.innerHTML = "";
    bookList.appendChild(loading);
    loading.style.display = "block";

    renderBooks(query).finally(() => {
        setTimeout(() => {
            loading.style.display = "none";
        });
    }, 2000);
    searchInput.value = "";
});

async function loadBook(id) {
    try {
        console.log(`Fetching book ID: ${id}`);

        const bookHtml = await fetchBookContent(id);
        const filteredContent = extractMainContent(bookHtml);
        renderBook(filteredContent, id);
    } catch (error) {
        console.error("Error fetching book:", error);
    }
}

// 🟢 Fetch book content from the server
async function fetchBookContent(id) {
    const response = await fetch(
        `https://proxy-server-o1yd.onrender.com/api/books/${id}`
    );
    return await response.text();
}

// 🟢 Extract main content (starting from <h1>)
function extractMainContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const headings = tempDiv.querySelectorAll("h1");
    if (headings.length > 0) {
        const firstHeading = headings[0];
        firstHeading.style.marginTop = "0";
        while (tempDiv.firstChild !== firstHeading) {
            tempDiv.removeChild(tempDiv.firstChild);
        }
    } else {
        console.warn("No <h1> found in the book content.");
    }

    return tempDiv.innerHTML;
}

// 🟢 Render book content inside a Shadow DOM
function renderBook(content, id) {
    const bookContainer = document.querySelector(".books");
    bookContainer.innerHTML = ""; // Clear previous content

    const bookReader = document.createElement("book-reader");
    const shadow = bookReader.attachShadow({ mode: "closed" });

    // Book wrapper for pagination
    const bookWrapper = document.createElement("div");
    bookWrapper.classList.add("book-content");

    // Normalize text (wrap all in <p> to maintain uniform styles)
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = content;

    tempContainer.querySelectorAll("div, span, section").forEach((el) => {
        const p = document.createElement("p");
        p.innerHTML = el.innerHTML;
        el.replaceWith(p);
    });

    bookWrapper.innerHTML = tempContainer.innerHTML;

    // Scroll position restoration
    const savedScroll = localStorage.getItem(`scroll-${id}`);
    if (savedScroll) {
        setTimeout(() => {
            bookWrapper.scrollTop = parseInt(savedScroll, 10);
        }, 100);
    }

    bookWrapper.addEventListener("scroll", () => {
        localStorage.setItem(`scroll-${id}`, bookWrapper.scrollTop);
    });

    // Pagination controls
    const prevButton = document.createElement("button");
    prevButton.textContent = "⬅";
    prevButton.classList.add("pagination-btn", "prev");
    prevButton.addEventListener("click", () => paginate(bookWrapper, -1));

    const nextButton = document.createElement("button");
    nextButton.textContent = "➡";
    nextButton.classList.add("pagination-btn", "next");
    nextButton.addEventListener("click", () => paginate(bookWrapper, 1));

    const homeButton = document.createElement("button");
    homeButton.textContent = "🏠";
    homeButton.classList.add("pagination-btn", "home");
    homeButton.addEventListener("click", () => {
        bookWrapper.scrollTop = 0;
        localStorage.removeItem(`scroll-${id}`);
    });

    // Sticky menu button for changing books
    const menuButton = document.createElement("button");
    menuButton.classList.add("menu");
    menuButton.innerHTML = "⋮";
    menuButton.addEventListener("click", () => {
        const confirmChange = confirm("Do you want to change the book?");
        if (confirmChange) {
            localStorage.removeItem("selectedBook");
            localStorage.removeItem(`scroll-${id}`);
            location.reload();
        }
    });

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .book-content {
            color: white;
            font-family: "JetBrains Mono", monospace;
            padding: 30px;
            height: 80vh;
            overflow-y: scroll;
            scrollbar-width: none;
            line-height: 1.5;
            text-align: justify;
            font-size: 1rem;
        }
        p, h1, h2, h3, h4, h5, h6 {
            margin-bottom: 10px;
            
        }
        p { font-size: 1rem; }
        h1 { font-size: 1.8rem; font-weight: bold; }
        h2 { font-size: 1.6rem; font-weight: bold; }
        h3 { font-size: 1.4rem; font-weight: bold; }
        h4 { font-size: 1.2rem; }
        h5 { font-size: 1rem; font-style: italic; }
        h6 { font-size: 0.9rem; font-style: italic; }
        a { color: white; text-decoration: none; }
        a:hover { color: orange; }

        .menu {
            position: fixed;
            bottom: 16.25rem;
            right: 2rem;
            background: rgba(255, 255, 255, 0);
            color: white;
            border: none;
            padding: 10px;
            font-size: 20px;
            cursor: pointer;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .menu:hover{
            background: rgba(255, 255, 255, 0.2);}
        .pagination-btn {
            position: fixed;
            bottom: 1rem;
            background: rgba(255, 255, 255, 0);
            color: white;
            border: none;
            padding: 10px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 50%;
            width: 40px;
            height: 40px;
        }
        .pagination-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .prev { right: 35rem;
    bottom: 10rem;
}
        .next { right: 1.7rem;
    bottom: 10rem;
     }

        .home {
            right: 35rem;
            bottom: 17rem;
        }


        @media screen and (min-width: 1024px) and (max-width: 1440px) {
        .home {
    right: 15rem;
    bottom: 17rem;
}           
        .prev{
            right: 15rem;
            bottom: 10rem;
        }
            
        }
    `;

    // Append elements to Shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(bookWrapper);
    shadow.appendChild(prevButton);
    shadow.appendChild(nextButton);
    shadow.appendChild(menuButton);
    shadow.appendChild(homeButton);
    shadow.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = anchor.getAttribute("href").substring(1); // Remove the "#"
            const targetElement = shadow.getElementById(targetId); // Find in Shadow DOM

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Append book reader to container
    bookContainer.appendChild(bookReader);

    // Save book selection
    localStorage.setItem("selectedBook", id);
}

// 🟢 Pagination function
function paginate(container, direction) {
    const pageHeight = 18 * 16;
    container.scrollBy({ top: direction * pageHeight, behavior: "smooth" });
}

document.querySelector(".book-list").addEventListener("click", (event) => {
    const clickedElement = event.target.closest(".book-link");
    console.log(clickedElement);
    console.log("clicked");
    if (clickedElement) {
        event.preventDefault(); // Prevent default navigation
        const bookDiv = document.querySelector(".books");
        bookDiv.innerHTML = "";
        const bookUrl = clickedElement.getAttribute("href");
        const bookId = bookUrl.split("/")[5];
        const loading = document.createElement("div");
        loading.classList.add("loader");
        bookDiv.appendChild(loading);
        loading.style.display = "block";
        loadBook(bookId).finally(() => {
            loading.style.display = "none";
        });
    }
});

// Get the iframe element
document.addEventListener("DOMContentLoaded", () => {
    const savedBookId = localStorage.getItem("selectedBook");
    if (savedBookId) {
        loadBook(savedBookId);
    }
});
