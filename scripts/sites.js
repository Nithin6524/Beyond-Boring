window.onload = async () => {
    const mostVisitedDiv = document.querySelector(".mostVisited");

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

  
    const initializeMostVisited = async () => {
        try {
            const mostVisitedURLs = await chrome.topSites.get();

            const promises = mostVisitedURLs.map(async (obj) => await getFavicon(obj.url));
            const siteDataList = await Promise.all(promises);

            siteDataList.slice(0,9).forEach((siteData) => {
                if (siteData) {
                    createSiteLink(siteData, mostVisitedDiv); 
                }
            });
        } catch (error) {
            console.error("Error fetching most visited sites:", error);
        }
    };

    
    initializeMostVisited();
};

