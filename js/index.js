const CAT_API_URL = "https://api.thecatapi.com/v1/images/search";
const DOG_API_URL = "https://api.thedogapi.com/v1/images/search";

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

console.log(fetchImage(CAT_API_URL));