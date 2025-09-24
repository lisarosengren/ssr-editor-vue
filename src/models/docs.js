const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetches all documents from the database
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
    const response = await fetch(baseURL);
    const result = await response.json();

    return result;
}

/**
 * Updates a document
 * @param {object} docToUpdate Object with the properties _id, title and content 
 * @returns {object} Returns the API response
 */
export async function updateDoc(docToUpdate) {

    const response = await fetch(`${baseURL}/update`, {
        body: JSON.stringify(docToUpdate),
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT'
    });
    if (!response.ok) {
        console.log(response);
        throw new Error("Database error");
    }

    return response;
}

/**
 * Gets an entry from the database
 * @param {string} id the id of the database entry 
 * @returns {object} response - the original response from fetch, result - the document data
 */
export async function getOne(id) {
    const response = await fetch(`${baseURL}/${id}`);
    const result = await response.json();
    if (!response.ok) {    
        console.log(result);
        throw new Error("Database error");    
    }
    
    return result;
}


const docs = { getAll, updateDoc, getOne }
export default docs;