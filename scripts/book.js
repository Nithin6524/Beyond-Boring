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
            books.slice(0, 3).forEach((book) => {
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

        const response = await fetch(`http://localhost:3000/api/books/${id}`);
        let bookHtml = await response.text();

        // Create a temporary div to parse the HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = bookHtml;

        // Find the first <h1> and remove everything before it
        const headings = tempDiv.querySelectorAll("h1");
        if (headings.length > 0) {
            const firstHeading = headings[0];
            firstHeading.style.marginTop = "0";
            // Remove all content before the first <h1>
            while (tempDiv.firstChild !== firstHeading) {
                tempDiv.removeChild(tempDiv.firstChild);
            }
        } else {
            console.warn("No <h1> found in the book content.");
        }

        // Select book container
        const bookContainer = document.querySelector(".books");

        // Clear previous content
        bookContainer.innerHTML = "";

        // Create a custom book-reader element
        const bookReader = document.createElement("book-reader");

        // Attach a Shadow DOM
        const shadow = bookReader.attachShadow({ mode: "closed" });

        // Create a container for the filtered content inside Shadow DOM
        const bookWrapper = document.createElement("div");
        bookWrapper.innerHTML = tempDiv.innerHTML; // Insert only the filtered content

        // Apply styles within the Shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            .book-reader {
                color: #fff;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                
            }
                .
            div {
                color:white;
                font-family:"JetBrains Mono", monospace;
            }
                h5{
                font-size: 1.5rem;
                }
                h6{
                font-size: 1.2rem;
                }h3{
                font-size: 2rem;
                }h1{
                font-size: 3rem;
                }
                p{
                font-size:1rem;
                }


                a{
                color: #fff;
                text-decoration: none;
                }
                a:hover {
                color: orange;
                }

                .menu {
                position: fixed;
                bottom:16.25rem;
                right: 2rem;
                background: rgba(255, 255, 255, 0.2);
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
        `;
        const menuButton = document.createElement("button");
        menuButton.classList.add("menu");
        menuButton.innerHTML = "⋮";
        menuButton.addEventListener("click", () => {
            const confirmChange = confirm("Do you want to change the book?");
            if (confirmChange) {
                localStorage.removeItem("selectedBook");
                location.reload(); // Refresh page to allow new selection
            }
        });
        // Append styles and book content inside the Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(bookWrapper);

        // Add the custom element to the book container

        shadow.appendChild(menuButton);
        bookContainer.appendChild(bookReader);
        localStorage.setItem("selectedBook", id);
    } catch (error) {
        console.error("Error fetching book:", error);
    }
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
