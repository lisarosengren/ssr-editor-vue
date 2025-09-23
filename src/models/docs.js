const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetches all documents from the database
 * @returns {object} result Returns JSON response from the API
 */
export async function getAll() {
        const response = await fetch(baseURL);
        const result = await response.json();

        return result
    }

/**
 * Updates a document
 * @param {object} docToUpdate Object with the properties _id, title and content 
 * @returns {object} Returns JSON with id, if succesful
 */
export async function updateDoc(docToUpdate) {

    const response = await fetch(baseURL, {
        body: JSON.stringify(docToUpdate),
        headers: {
            'content-type': 'application/json'            
        },
        method: 'PUT'
    });

    return response;
}

export async function getOne(id) {

}


const docs = { getAll, updateDoc, getOne }
export default docs;