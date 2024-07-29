const proxyUrl = "https://corsproxy.io/?";
let currentImageUrl = "";

async function fetchBlob(proxyUrl, url) {
    try {
        const response = await fetch(proxyUrl + url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.blob();
    } 
    catch (error) {
        console.error(`Fetching error: ${error}`);
        throw error;
    }
}

export function initializePopup() {
    document.addEventListener("DOMContentLoaded", () => {
        const popupHTML = `
            <div id="popup" class="popup">
                <div class="popup-content">                    
                    <span id="exitBtn" class="exit-button">&times;</span>
                    <img id="popupImg" class="popup-image" src="" alt="">
                    <p id="popupName"></p>
                    <div class="popup-options">
                        <p id="popupDimensions"></p>
                        <div class="button-container">    
                            <button id="downloadBtn">Download</button>
                            <img src="images/doggoPeek.png" alt="Cat Peek">
                        </div>    
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", popupHTML);

        const popup = document.getElementById("popup");
        const exitButton = document.getElementById("exitBtn");
        const downloadButton = document.getElementById("downloadBtn");

        exitButton.onclick = () => {
            popup.style.display = "none";
            //document.body.style.overflow = "auto"; // Enable scrolling            
        };

        window.onclick = (event) => {
            if (event.target == popup) {
                popup.style.display = "none";
                //document.body.style.overflow = "auto"; // Enable scrolling                
            }
        };

        downloadButton.onclick = async () => {
            try {
                const blob = await fetchBlob(proxyUrl, currentImageUrl);
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");

                link.href = blobUrl;
                link.download = "img.jpg";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(blobUrl);
            } 
            catch (error) {
                console.error(`Fetching error downloadButton: ${error}`);
            }
        };
    })
}

export function openPopup(imageName, imageUrl, HxW) {
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popupImg");
    const popupDimensions = document.getElementById("popupDimensions");
    const popupName = document.getElementById("popupName"); 

    currentImageUrl = imageUrl;

    popup.style.display = "flex";
    popupImage.src = imageUrl;
    popupName.innerHTML = imageName;
    popupDimensions.innerHTML = `${HxW[0]} x ${HxW[1]}`; 

    //document.body.style.overflow = "hidden"; // Disable scrolling
}