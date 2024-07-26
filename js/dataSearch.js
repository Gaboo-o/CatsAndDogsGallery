const normalizeInput = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

function splitBreedNames(names) {
    let nameMap = new Map();

    names.forEach(n => {
        let parts = n.name.split(' ');
        parts.forEach(part => {
            if (!nameMap.has(part)) {
                nameMap.set(part, new Set());
            }
            nameMap.get(part).add(n.id);
        });
    });

    let sortedEntries = Array.from(nameMap.entries()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    
    let sortedNameMap = new Map(sortedEntries);

    return sortedNameMap;
}

const binarySearchFirstLetter = (map, letter) => {
    const keys = Array.from(map.keys()).sort();
    let left = 0, right = keys.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midKey = keys[mid];
        if (midKey[0].toLowerCase() < letter) {
            left = mid + 1;
        } else if (midKey[0].toLowerCase() > letter) {
            right = mid - 1;
        } else {
            while (mid > 0 && keys[mid - 1][0].toLowerCase() === letter) {
                mid--;
            }
            return mid;
        }
    }
    return left;
};

const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }
    
    return matrix[a.length][b.length];
};

const findBestMatch = (breedName, breeds) => {
    let breedMatches = [];
    const differenceThreshold = 3;
    const targetFirstLetter = breedName[0];

    for (const [key, values] of breeds) {
        const normalizedBreedName = normalizeInput(key);

        // console.log(normalizedBreedName + " === " + breedName);
        // console.log(values);

        // Stop if we looked at all the entries that match the first letter
        if (normalizedBreedName[0] > targetFirstLetter) break;

        // Skip entries that dont match first letter
        if (normalizedBreedName[0] !== targetFirstLetter) continue;

        // Check for exact match
        if (normalizedBreedName === breedName) {
            breedMatches.push({ breed: values, difference: 0 });
            continue;
        }

        // Check for substring match
        if (normalizedBreedName.includes(breedName) || breedName.includes(normalizedBreedName)) {
            breedMatches.push({ breed: values, difference: 1 });
            continue;
        }

        // Calculate Levenshtein distance
        const difference = levenshteinDistance(normalizedBreedName, breedName);
        if (difference <= differenceThreshold) {
            breedMatches.push({ breed: values, difference });
        }
    }

    // console.log(breedMatches);

    return breedMatches;
}

export const searchBreed = async (breedName, catBreeds, dogBreeds) => {

    // console.log(breedName);

    const normalizedBreedName = normalizeInput(breedName);
    const firstLetter = normalizedBreedName[0];

    // console.log(normalizedBreedName);
    // console.log(firstLetter);

    const splitCatBreeds = splitBreedNames(catBreeds);
    const splitDogBreeds = splitBreedNames(dogBreeds);

    // console.log(splitCatBreeds);
    // console.log(splitDogBreeds); 

    const catStartIndex = binarySearchFirstLetter(splitCatBreeds, firstLetter);
    const dogStartIndex = binarySearchFirstLetter(splitDogBreeds, firstLetter);

    // console.log(catStartIndex);
    // console.log(dogStartIndex);

    const filteredCatBreeds = Array.from(splitCatBreeds.entries()).slice(catStartIndex);
    const filteredDogBreeds = Array.from(splitDogBreeds.entries()).slice(dogStartIndex);

    // console.log(filteredCatBreeds);
    // console.log(filteredDogBreeds);

    const catBreed = findBestMatch(normalizedBreedName, filteredCatBreeds);
    const dogBreed = findBestMatch(normalizedBreedName, filteredDogBreeds);

    // console.log(catBreed);
    // console.log(dogBreed);

    return [catBreed, dogBreed];
};