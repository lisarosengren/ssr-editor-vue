const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetches all documents from the database
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
    const response = await fetch(baseURL);
    if (!response.ok) {
        console.log(response);
        throw new Error("Database error");
    }
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
 * @returns {object} result the document data
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

/**
 * Creates a new document in the database
 * @param {object} body the title and the content of the new document
 * @returns {object} the response from the API
 */
export async function newDoc(newDocData) {

    const response = await fetch(`${baseURL}/`, {
        body: JSON.stringify(newDocData),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    });
    if (!response.ok) {
        console.log(response);
        throw new Error("Database error");
    }
    const result = await response.json()
    
    return result.insertedId;
}

const docs = { getAll, updateDoc, getOne, newDoc }
export default docs;