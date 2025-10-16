const baseURL = import.meta.env.VITE_API_URL;

/**
 * Gets user id and token from local storage, fetches all documents from
 * the database (that matches user id).
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
  const token = localStorage.getItem('token');
  const response = await fetch(baseURL, {
    body: JSON.stringify({userId: localStorage.getItem('userId')}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  );
  if (!response.ok) {
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
 * @param {object} newDocData the title and the docType of the new document
 * @returns {object} the response from the API and the newly created id.
 */
export async function newDoc(newDocData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/newdoc`, {
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
 * @param {object} body the email and password (and potentially invite token) of the new user
 * @returns {object} the newly created user id and login token
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
    localStorage.setItem('token', result.token);
    return result;
}
/**
 * User login
 * @param {object} userData user email and password and invite token if exists
 * sets jwt in local storage
 * @returns {object}
 */
export async function userLogin(userData) {
  const response = await fetch(`${baseURL}/user/login`, {
    body: JSON.stringify(userData),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });
  if (!response.ok) {
      throw new Error("Login error");
  }

  const result = await response.json();
  localStorage.setItem('token', result.token);
  console.log("i have set a login token")
  console.log(result.message)
  return result;
}
/**
 * Gets user info from the database by matching email (or id)
 * @returns {object} result _id, email
 */
export async function getUser() {
  // const userEmail = localStorage.getItem('email')
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/user/home`, {
    body: JSON.stringify(),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
      // throw new Error("Failed to get user");
      console.log(response);
  }

  const result = await response.json();
  return result;
}

/**
 * sends a request to send an email with a link to register
 * @param {string} email email address to send invitation to
 * @param {string} docId document id
 */
export async function mailInvitation(inviteEmail, docId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/mail/invite`, {
    body: JSON.stringify({ recipient: inviteEmail, docId: docId}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response);
}

export async function checkInvite() {
  console.log("checking if invited user is logged in");
  const inviteToken = localStorage.getItem('invite-token');
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/user/compare`, {
    body: JSON.stringify({ inviteToken: inviteToken}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  // console.log(response);
  const result = await response.json();
  console.log(result);
  return result;
}

export async function inviteDoc() {
  console.log("getting invite info");
  const inviteToken = localStorage.getItem('invite-token');
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/user/invite`, {
    body: JSON.stringify({ inviteToken: inviteToken}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response);
  const result = await response.json();
  console.log(result);
  return result;
}

export async function acceptInvite(userId, docId) {
  console.log("user wants to accept invite")
  const token = localStorage.getItem('token');
  const response = await fetch(`${baseURL}/update`, {
    body: JSON.stringify({ userId: userId, _id: docId}),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response);
  const result = await response.json();
  console.log(result)
  return result;
    }

const docs = { getAll, updateDoc, getOne, newDoc, sendCode, newUser, getUser, mailInvitation, inviteDoc, acceptInvite }
export default docs;
