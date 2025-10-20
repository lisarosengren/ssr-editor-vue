const baseURL = import.meta.env.VITE_API_URL;

/**
 * Gets user id and token from local storage, fetches all documents from
 * the database (that matches user id).
 * @returns {array} result Returns JSON response from the API
 */
export async function getAll() {
  console.log("trying new getall")
  const token = localStorage.getItem('token');
  // console.log("token", token)
  const response = await fetch(`${baseURL}/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '{ documentList { _id title } }'
    })
  });
  console.log("getall response", response)
  if (!response.ok) {
    throw new Error(response.status);
  }

  const result = await response.json();
  console.log("getall result.data.documentLIst", result.data.documentList)
  if (result.errors) {
    throw new Error(response.errors);
  }

  return result.data.documentList;
}



//Den här används väl inte längre?
// /**
//  * Updates a document
//  * @param {object} docToUpdate Object with the properties _id, title and content
//  * @returns {object} Returns the API response
//  */
// export async function updateDoc(docToUpdate) {

//     const response = await fetch(`${baseURL}/update`, {
//         body: JSON.stringify(docToUpdate),
//         headers: {
//             'content-type': 'application/json'
//         },
//         method: 'PUT'
//     });
//     if (!response.ok) {
//         throw new Error("Database error");
//     }
// }

/**
 * Gets an entry from the database
 * @param {string} id the id of the database entry
 * @returns {object} result the document data
 */
export async function getOne(id) {
  console.log("get one function called")
  const token = localStorage.getItem('token');
  const query = `
    query GetDocument($id: ID!) {
      document(_id: $id) {
        _id
        title
        content
        users {
          _id
          email
          }
      }
    }
  `
  const variables = { id };
  const response = await fetch(`${baseURL}/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/graphql-response+json, application/json'
    },
    body: JSON.stringify({
      query,
      variables
    }),
  });
  console.log(response)
  if (!response.ok) {
      throw new Error("Database error");
  }

  const result = await response.json();
  console.log(result.data.document)


  return result.data.document;
}

/**
 * Creates a new document in the database
 * @param {object} newDocData the title and the docType of the new document
 * @returns {object} the response from the API and the newly created id.
 */
export async function newDoc(newDocData) {
  console.log("calling save new doc")
  const token = localStorage.getItem('token');
  const query = `
    mutation AddDoc($title: String!, $type: String!) {
      addDocument(title: $title, type: $type) {
          acknowledged
          insertedId
          }
      }`

  console.log("token got ", token)
  console.log("newDocData", newDocData.title, newDocData.type)
  const response = await fetch(`${baseURL}/graphql`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: {
          title: newDocData.title,
          type: newDocData.type
        }
      })
  });
  const result = await response.json()
  console.log("Funkar newDoc?", result.data.addDocument)
  return result.data.addDocument
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
  console.log("new user called")
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
    console.log("new user result", result)
    localStorage.setItem('token', result.token);
    return result;
}
/**
 * User login
 * @param {object} userData user email and password and invite token if exists
 * sets jwt in local storage
 * @returns {object}
 */
export async function userLogin(user) {
  console.log("trying to log in user")
  console.log("user", user)
  console.log("this is body", JSON.stringify(user))
  const response = await fetch(`${baseURL}/user/login`, {
    body: JSON.stringify(user),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });
  console.log("login response", response)
  if (!response.ok) {
      throw new Error("Login error");
  }

  const result = await response.json();
  localStorage.setItem('token', result.token);
  console.log("i have set a login token")
  console.log("login result", result)// { token: , message:  }
  return result;
}
/**
 * Gets user info from the database by matching email (or id)
 * @returns {object} result _id, email
 */
export async function getUser() {
  console.log("get user called")
  const token = localStorage.getItem('token');
  console.log("attempting to get user- token", token)
  const response = await fetch(`${baseURL}/graphql`, {
    // body: JSON.stringify(),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: '{ user { _id email } }'
    })
  });
  if (!response.ok) {
      // throw new Error("Failed to get user");
      console.log(response);
  }

  const result = await response.json();
  console.log("getuser result", result)
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
  console.log(result); // objekt invite (decoded token)
  console.log(result.invite.documentId) // = id
  return result;
}
///// OBS! Här är det ett objekt, med bara ett innehåll.
/**
 *
 * @param {string} docId
 * @returns
 */
export async function acceptInvite(body) {
  console.log("user wants to accept invite")
  const token = localStorage.getItem('token');
  const query = `
    mutation AddUser($docId: ID!) {
      addUserToDoc(docId: $docId) {
        acknowledged
        }
      }`
  const response = await fetch(`${baseURL}/graphql`, {

    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        docId: body.docId
      }
    }),
  });
  console.log(body.docId)
  const result = await response.json();
  console.log("after acceptInvite - ", result)

  return result;
    }

const docs = { getAll, getOne, newDoc, sendCode, newUser, getUser, mailInvitation, inviteDoc, acceptInvite }
export default docs;
