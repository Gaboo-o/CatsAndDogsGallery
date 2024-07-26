export const CAT_API_BRD = "https://api.thecatapi.com/v1/breeds";
export const CAT_API_URL = "https://api.thecatapi.com/v1/images/search?has_breeds=1";
export const CAT_API_KEY = "live_XFDulpkchxTEY8cczVZwB7y8cWuDjosje2YJuiotpSWcRCFQQspdEntpJVxoIJqg";

export const DOG_API_BRD = "https://api.thedogapi.com/v1/breeds";
export const DOG_API_URL = "https://api.thedogapi.com/v1/images/search?has_breeds=1";
export const DOG_API_KEY = "live_k6Hdb8yLShViDQ4nfVUxZ617VH8jG60fMlrXuB8OurToBTZrSGDwJiis8NXWd0wF";

async function fetchData(url, api_key) {
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': api_key
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetching error: ${error}`);
    }
}

export const fetchBreedData = async () => {
    const catBreeds = await fetchData(CAT_API_BRD, CAT_API_KEY);
    const dogBreeds = await fetchData(DOG_API_BRD, DOG_API_KEY);

    return [catBreeds, dogBreeds];
}

export const fetchBreedImages = async (breed, type, size) => {
    const [url, key] = (type == "cat") ? [CAT_API_URL, CAT_API_KEY] : [DOG_API_URL, DOG_API_KEY];
    const images = fetchData(`${url}&limit=${size}&breed_ids=${breed}`, key);

    return images;
}