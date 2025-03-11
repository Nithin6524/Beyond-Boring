async function initializeMostVisited() {
    const mostVisitedDiv = document.querySelector(".mostVisited");
    console.log("most visited div");

    const getFavicon = async (url) => {
        const faviconURL = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${url}&size=40`;
        return { icon: faviconURL, link: url };
    };

    const createSiteLink = ({ icon, link }, targetDiv) => {
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container");

        const siteLink = document.createElement("a");
        siteLink.classList.add("site-link");
        siteLink.target = "_blank";
        siteLink.href = link;

        const imgElement = document.createElement("img");
        imgElement.classList.add("site-image");
        imgElement.src = icon;
        imgElement.alt = `Favicon for ${new URL(link).hostname}`;

        siteLink.appendChild(imgElement);
        linkContainer.appendChild(siteLink);
        targetDiv.appendChild(linkContainer);
    };

    try {
        const mostVisitedURLs = await new Promise((resolve, reject) => {
            chrome.topSites.get((sites) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(sites);
                }
            });
        });

        const faviconsPromises = mostVisitedURLs
            .slice(0, 9)
            .map(async (site) => {
                return await getFavicon(site.url);
            });

        const favicons = await Promise.all(faviconsPromises);

        favicons.forEach((siteData) => {
            if (siteData) {
                createSiteLink(siteData, mostVisitedDiv);
            }
        });
    } catch (error) {
        console.error("Error fetching most visited sites:", error);
    }
}


initializeMostVisited();
