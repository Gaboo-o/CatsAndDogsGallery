import { fetchBreedData, fetchBreedImages } from "./dataFetch.js";
import { searchEntry } from "./dataSearch.js";
import { loadImages, imagesNotFound } from "./dataLoad.js";
import { initializePopup, openPopup } from "./imagePopup.js";

/*
*  Get / Initialize HTML
*/

const imageGrid = document.getElementById("imageGrid");

initializePopup();

/*
*  Fetch array of all cat/dog breeds
*/

let catBreeds = [];
let dogBreeds = [];

(async () => [catBreeds, dogBreeds] = await fetchBreedData())();

/*
*  Search for, retrieve, and load cat/dog breed images from array
*/

const IMAGES_TO_LOAD = 10;

async function handleImages() {
    const breedName = document.getElementById("searchInput").value.trim().toLowerCase();

    // Perform search for cat and dog breeds concurrently
    const [catMatches, dogMatches] = await Promise.all([
        searchEntry(breedName, catBreeds),
        searchEntry(breedName, dogBreeds)
    ]);

    // Tag entries with their type
    const taggedCatMatches = catMatches ? catMatches.map(match => ({ ...match, type: "cat" })) : [];
    const taggedDogMatches = dogMatches ? dogMatches.map(match => ({ ...match, type: "dog" })) : [];

    // Combine and sort entries by similarity
    const allMatches = [...taggedCatMatches, ...taggedDogMatches];
    allMatches.sort((a, b) => a.difference - b.difference);

    if (allMatches.length === 0) {
        imagesNotFound(imageGrid);
    } else {
        await Promise.all(allMatches.map(async match => {
            for (const breed of match.breed) {
                const breedImages = await fetchBreedImages(breed, match.type, IMAGES_TO_LOAD);
                loadImages(imageGrid, breedImages, openPopup);
            }
        }));
    }
}


// remove all child elements from a parent element in the DOM
const deleteChildElements = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

document.getElementById("searchButton").addEventListener("click", () => {
    deleteChildElements(imageGrid);
    handleImages();
});

document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        deleteChildElements(imageGrid);
        handleImages();
    }
});

/**********************************************************************************/

// Create footer element
const footer = document.getElementById("copyright");

// Get current year
const today = new Date();
const thisYear = today.getFullYear();

// Create copyright element
const copyright = document.createElement("p");
copyright.innerHTML = `&copy; ${thisYear} Gabriel Valle. All rights reserved.`;

// Append copyright element to footer
footer.appendChild(copyright);