const sizes = ["horizontal", "vertical", "square", ""];

export function loadImages(imageGrid, images, openPopup) {
    images.forEach((image) => {
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        const divElement = document.createElement("div");
        divElement.classList.add("image-container");
        if (randomSize) {
            divElement.classList.add(randomSize);
        }

        const imageName = image.breeds[0].name;
        const imageUrl = image.url;

        divElement.innerHTML = `
            <img src="${imageUrl}" alt="${imageName}">
            <div class="image-overlay">
                <p>${imageName}</p>
            </div>
        `;        

        divElement.addEventListener("click", () => {
            openPopup(imageName, imageUrl, [image.height, image.width]);
        });

        imageGrid.appendChild(divElement);
    });
}

export function imagesNotFound(imageGrid) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("no-results-container");

    messageContainer.innerHTML = `
        <p class="no-results-icon">&#128575;</p>
        <p class="no-results-message">No results found</p>
    `;

    imageGrid.appendChild(messageContainer);
}