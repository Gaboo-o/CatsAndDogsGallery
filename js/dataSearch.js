/**
* Sets string to lowercase and removes non-alpha chars 
* @param {String} str
* @return {String} normalizedStr
*/

const normalizeStr = (str) => {
    return str.toLowerCase().replace(/[^a-z]/g, "");
};


/**
* Separates string into substrings and 
* sets all to lowercase and removes non-alpha chars 
* @param {String} str
* @return {String} allNormalizedSubstr
*/

const normalizeAndSplitStr = (str) => {
    return str.toLowerCase().split(" ").map(substr => substr.replace(/[^a-z]/g, ""));
};


/**
* Splits string entries from array into individual substrings
* and maps them to their corresponding values
* @param {Array} arr - array of strings
* @return {Array} arr
*/

function splitStringsArr(arr) {
    let strMap = new Map();

    // Iterate over each array entry (string)
    arr.forEach(arrEntry => {
        // Split entry 
        let entrySubstr = arrEntry.name.split(" ");

        // Iterate over each entry substring
        entrySubstr.forEach(substr => {
            // If the entry substring is not in the map (as a key)
            if (!strMap.has(substr)) {
                // Add entry substring to map as new key with its id as the value
                strMap.set(substr, new Set([arrEntry.id]));
            }
            else {
                // Find existing key and add the entry substring to its value set
                strMap.get(substr).add(arrEntry.id);
            }
        });
    });

    // Convert map into array and sort alphabetically
    return Array.from(strMap.entries()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
}


/**
* Performs a binary search to find the index of first entry 
* in an array with a given first letter
* @param {Array} arr
* @param {String} targetChar
* @return {Number} index
*/

const binarySearchChar = (arr, targetChar) => {
    // Get the array's boundaries
    let leftBoundary = 0, rightBoundary = arr.length - 1;

    while (leftBoundary <= rightBoundary) {
        // Find the middle index and get its key
        let centerPoint = Math.floor((leftBoundary + rightBoundary) / 2);
        // Get the middlePoint's key's first letter
        let centerPointChar = arr[centerPoint][0][0].toLowerCase();

        // Compare centerPointChar with the target char
        if (centerPointChar < targetChar) {
            // Move the leftBoundary to the center
            leftBoundary = centerPoint + 1;
        } 
        else if (centerPointChar > targetChar) {
            // Move the rightBoundary to the center
            rightBoundary = centerPoint - 1;
        } 
        else {
            // If first letter matches, go backwards to find the first entry
            while (centerPoint > 0 && arr[centerPoint - 1][0].toLowerCase() === targetChar) {
                centerPoint--;
            }

            return centerPoint;
        }
    }

    // No match found
    return leftBoundary;
};


/**
* Calculate the Levenshtein distance between two strings based on
* deletion, insertion, and substitution
* @param {String} str
* @param {String} targetStr
* @return {Number} distance
*/

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


/**
* Find the best matches for a string in a sorted array
* @param {String} str
* @param {String} arr
* @return {Array} matchesArr
*/

const findBestMatch = (str, arr) => {
    let matchesArr = [];
    const differenceThreshold = 3;
    const targetFirstLetter = str[0];

    // Iterate over arr 
    for (const [key, values] of arr) {
        const normalizedKey = normalizeStr(key);

        // Stop if we looked at all the entries that match the first letter
        if (normalizedKey[0] > targetFirstLetter) break;

        // Skip entries that dont match first letter
        if (normalizedKey[0] !== targetFirstLetter) continue;

        // Check for exact match
        if (normalizedKey === str) {
            matchesArr.push({ breed: values, difference: 0 });
            continue;
        }

        // Check for substring match
        if (normalizedKey.includes(str) || str.includes(normalizedKey)) {
            matchesArr.push({ breed: values, difference: 0.5 });
            continue;
        }

        // Calculate Levenshtein distance
        const difference = levenshteinDistance(normalizedKey, str);
        if (difference <= differenceThreshold) {
            matchesArr.push({ breed: values, difference });
        }
    }

    return matchesArr;
}


/**
* Search for matches in array based on the search string
* @param {String} str - string to search
* @param {String} arr
* @return {Array} matchesArr
*/

export const searchEntry = async (str, arr) => {
    // Normalize and split the search string into individual substrings
    const allSubstr = normalizeAndSplitStr(str);

    const allSplitStr = splitStringsArr(arr);

    const searchWord = async (substr, allSplitStr) => {
        const firstLetter = substr[0];
        // Get the index of the first entry in the array with the matching first letter
        const startIndex = binarySearchChar(allSplitStr, firstLetter);
        // Reduce array to start at index
        const reducedSplitStr = allSplitStr.slice(startIndex);

        return findBestMatch(substr, reducedSplitStr);
    };

    // Make Promise to search for each word simultaneously and wait for them
    const searchPromises = allSubstr.map(substr => searchWord(substr, allSplitStr));
    const matches = await Promise.all(searchPromises);

    return matches.flat();
};