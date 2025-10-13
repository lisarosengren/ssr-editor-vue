const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetches all documents from the database
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const response = await fetch(baseURL, {
    body: JSON.stringify(userId),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  );
  // fetch(baseURL).then(res => console.log(res));

  if (!response.ok) {
    console.log(response)
      throw new Error(response.status);
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
  const token = localStorage.getItem('token');
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
      throw new Error("Database error");
  }

  const result = await response.json();


  return result;
}

/**
 * Creates a new document in the database
 * @param {object} body the title and the docType of the new document
 * @returns {object} the response from the API
 */
export async function newDoc(newDocData) {
  const token = localStorage.getItem('token');

  newDocData.userId = localStorage.getItem('userId');

  const response = await fetch(`${baseURL}/`, {
      body: JSON.stringify(newDocData),
      headers: {
        'Authorization': `Bearer ${token}`,
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

/**
 * Sends a code document to an endpoint for execution.
 * @param { string } codeString The content of a code document.
 * @returns { string } The output/result of the executed code.
 */
export async function sendCode(codeString) {
  // console.log('calling docs function');

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

/**
 * Creates a new user in the database
 * @param {object} body the email and password of the new user
 * @returns {object} the response from the API
 */
export async function newUser(newUserData) {

    const response = await fetch(`${baseURL}/user/register`, {
        body: JSON.stringify(newUserData),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    });
    if (!response.ok) {
        // console.log(response);
        throw new Error("Registration error");
    }
    const result = await response.json()

    return result.insertedId;
}
/**
 * User login
 * @param {object} userData user email and password
 * sets jwt and user id in local storage
 * @returns {object}
 */
export async function userLogin(userData) {
  console.log("login function, trying to send request")
  console.log("userData: ", userData)
  const response = await fetch(`${baseURL}/user/login`, {
    body: JSON.stringify(userData),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });
  console.log(response)
  if (!response.ok) {
      throw new Error("Login error");
  }

  const result = await response.json();
  localStorage.setItem('token', result.token);
  localStorage.setItem('email', result.email);
  console.log(localStorage);

  return result.status;
}
/**
 * Gets a user from the database
 * @param {string} userEmail
 * @returns {object} result user
 */
export async function getUser(userEmail) {
  console.log("getuser function, trying to send request")
  console.log("user email: ", userEmail)
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/user/user`, {
    body: JSON.stringify({ email: userEmail}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response)
  if (!response.ok) {
      throw new Error("Failed to get user");
  }

  const result = await response.json();


  return result;
}

const docs = { getAll, updateDoc, getOne, newDoc, sendCode, newUser, getUser }
export default docs;
