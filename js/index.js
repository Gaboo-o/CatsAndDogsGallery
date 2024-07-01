const CAT_API_URL = "https://api.thecatapi.com/v1/images/search?has_breeds=1";
const DOG_API_URL = "https://api.thedogapi.com/v1/images/search?has_breeds=1";

async function fetchImage(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(response.status);
        }

        return await response.json();
    }
    catch (error) {
        console.error(error);
    }
}

async function loadImages() {
    const imageGrid = document.querySelector(".image-grid");

    // Fetch cat images
    const catImages = await Promise.all(
        Array.from({ length: 5 }, () => {
            return fetchImage(CAT_API_URL);
        })
    );
    // Fetch dog images
    const dogImages = await Promise.all(
        Array.from({ length: 5 }, () => {
            return fetchImage(DOG_API_URL);
        })
    );

    // Combine arrays
    const allImages = [...catImages, ...dogImages];
    allImages.sort(() => Math.random() - 0.5);

    const sizes = ["horizontal", "vertical", "square", ""];

    allImages.forEach((images) => {
        const imgElement = document.createElement("img");
        imgElement.src = images[0].url;
        
        const pElement = document.createElement("p");
        pElement.innerHTML = "test";

        // console.log(images[0].breeds[0].name);

        const overlayDiv = document.createElement("div");
        overlayDiv.classList.add("image-overlay");
        overlayDiv.appendChild(pElement);

        const divElement = document.createElement("div");
        divElement.classList.add("image-container");
        divElement.appendChild(imgElement);
        divElement.appendChild(overlayDiv);

        // Randomly assign a size class
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        if (randomSize) {
            divElement.classList.add(randomSize);
        }

        imageGrid.appendChild(divElement);
    });
}

function isBottomOfPage() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
}

function handleScroll() {
    if (isBottomOfPage()) {
        loadImages();
    }
}

window.addEventListener("scroll", handleScroll);

// Initial load
loadImages();