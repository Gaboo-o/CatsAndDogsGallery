export function initializePopup() {
    document.addEventListener("DOMContentLoaded", () => {
        const popupHTML = `
            <div id="popup" class="popup">
                <div class="popup-content">                    
                    <span id="exit" class="exit-button">&times;</span>
                    <img id="popupImage" class="popup-image" src="" alt="">
                    <p id="popupName"></p>
                    <div class="popup-options">
                        <p id="popupDimensions"></p>
                        <div>
                            <img src="images/doggoPeek.png" alt="Dog Peek">
                            <button id="share">Share</button>
                        </div>
                        <div>    
                            <img src="images/doggoPeek.png" alt="Cat Peek">
                            <button id="download">Download</button>
                        </div>    
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", popupHTML);

        const popup = document.getElementById("popup");
        const exitButton = document.getElementById("exit");
        const downloadButton = document.getElementById("download");
        const shareButton = document.getElementById("shareBtn");

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
    });
}

export function openPopup(imageName, imageUrl, HxW) {
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popupImage");
    const popupDimensions = document.getElementById("popupDimensions");
    const popupName = document.getElementById("popupName"); 

    popup.style.display = "flex";
    popupImage.src = imageUrl;
    popupName.innerHTML = imageName;
    popupDimensions.innerHTML = `${HxW[0]} x ${HxW[1]}`; 

    //document.body.style.overflow = "hidden"; // Disable scrolling
}