const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetches all documents from the database
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
    const response = await fetch(baseURL);
    fetch(baseURL).then(res => console.log(res));

    if (!response.ok) {
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
}

/**
 * Gets an entry from the database
 * @param {string} id the id of the database entry
 * @returns {object} result the document data
 */
export async function getOne(id) {
    const response = await fetch(`${baseURL}/${id}`);

    if (!response.ok) {
        console.log(response);
        throw new Error("Database error");
    }

    const result = await response.json();


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
        // console.log(response);
        throw new Error("Database error");
    }
    const result = await response.json()

    return result.insertedId;
}

export async function sendCode(codeString) {
  console.log('calling docs function');

  try {
    const data = {
      code : btoa(codeString)
    };

    const response = await fetch("https://execjs.emilfolino.se/code", {
      body: JSON.stringify(data),
      headers: {
          'content-type': 'application/json'
      },
      method: 'POST'
    });

    const result = await response.json();

    const output = atob(result.data);
    return output;
  } catch (error) {
    console.error('An error occurred: ', error);
    throw new Error('Could not execute');
  }
}

const docs = { getAll, updateDoc, getOne, newDoc, sendCode }
export default docs;
