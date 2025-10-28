<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, provide, onMounted, watch, reactive } from 'vue'
import { getUser, checkInvite, inviteDoc, getAll } from './models/docs'
import UserDocs from './components/UserDocs.vue'
import UserLogin from './components/UserLogin.vue'
import NewUser from './components/NewUser.vue'
import FailComponent from './components/FailComponent.vue'

const route = useRoute()

const userState = reactive({
  user: null,
  loggedIn: false,
  inviteToken: null,
});

const login = ref(false);
const register = ref(false);
const invite = ref(null);
const documents = ref([]);
const err = ref(false);
let buttons = ref(true);

provide('invite', invite);
provide('userState', userState);
provide('documents', documents);
provide('errorState', err)

function resetError(){
  err.value = false;
}

async function reloadDocs() {
  documents.value = await getAll();
}


async function loginUser(loggedInUser) {
  userState.user = loggedInUser;
  userState.loggedIn = true;
  await reloadDocs();

  const inviteToken = localStorage.getItem('invite-token');

  if (inviteToken) {
    const sameUser = await checkInvite();

    if (!sameUser) {
      console.warn("invite is not for you!");
      alert("Nej, va, den här inbjudan var inte till dig!");
      logout();
      return;
    }
    try {
      invite.value = await inviteDoc();
      console.log("invite after login ", invite.value);
    } catch (err) {
      console.error("failed to fefth", err);
    }
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('invite-token')
  userState.user = null
  userState.loggedIn = false
  window.location.href = '/'// full reload to reset
  buttons.value = false;
}

watch(
  () => route.query.token,
  async (urlToken) => {
    if (!urlToken) return;
    localStorage.setItem('invite-token', urlToken);
    userState.inviteToken = urlToken;

    const token = localStorage.getItem('token');

    if (token) {
      const sameUser = await checkInvite();

      if (sameUser == false) {
        alert(`You are trying to access an invite that was sent to another user.
              Please log in with the correct user information.
              Loggin you out.`);
        logout();
        return;
      }
      try {
        invite.value = await inviteDoc();
      } catch (err) {
        console.error("failed to fetch invite", err);
      }
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const token = localStorage.getItem('token');

  if (token) {
    const currentUser = await getUser();

    userState.user = currentUser;
    userState.loggedIn = true;

    documents.value = await getAll();
  }
  });
</script>

<template>
  <header class="column">

  <div class="left half appname">
    <RouterLink @click="buttons = true; login = false; register = false" to="/"><h1 class="header">Bobcat Noir</h1><h2>ssr-editor</h2></RouterLink>

  </div>
  <div v-if="userState.loggedIn && userState.user" class="right half">
    <p>inloggad som: <br>{{  userState.user.email }}</p>
    <button class="button logout" @click="logout">logga ut</button>
  </div>
  </header>

  <main :class="{ main: userState.loggedIn, center: !userState.loggedIn }" v-if="!err">
    <div v-if="userState.loggedIn" class="sidebar left">
        <UserDocs @doc-created="reloadDocs"/>
    </div>

      <RouterView class="editor" v-if="userState.loggedIn" @doc-created="reloadDocs"/>
      <div v-else>
        <div class="center">
          <button v-if="buttons" class="button" @click="login = true; register = false; buttons = false">Logga in</button>
          <button v-if="buttons" class="button" @click="register = true; login = false; buttons = false">Skapa konto</button>
          <UserLogin v-if="login" @changed-mind="register = true; login = false;" @login-success="loginUser" />
          <NewUser v-if="register" @changed-mind="register = false; login = true;" @register-success="loginUser" />
        </div>
      </div>


  </main>

  <main v-else>
    <div class="center">
      <FailComponent  @back="resetError"/>
    </div>
  </main>

  <footer>
    <p class="footer">Ett JSramverkprojekt av Emma och Lisa</p>
  </footer>

</template>

<style>
header {
  margin-bottom: 3.6em;
  border-bottom: #04AA6D 1px solid;
}

footer {
  margin-left: 1em;
  margin-right: 1em;
  border-top: #04AA6D 1px solid;
  text-align: center;
  color: rgb(0, 91, 60);
}

.header {
  font-size: 4em;
  margin-left: 0.2em;
  margin-top: 0;
  margin-bottom: 0;
}

h2 {
  margin-top: 0;
  margin-left: 0.7em;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.left {
  text-align: left;
  margin-left: 0;
}
.right {
  text-align: right;
  margin-right: 0;
}
.half {
  width: 100%;
}
.appname {
  display: none;
}

.sidebar .left {
  padding-right: 1em;
}

.editor {
  width: 80%;
}
form > {
  margin-bottom: 8px;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
input[type=select] {
  padding: 1rem;
  margin-bottom: 1rem;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

.button {
  display: inline-block;
  padding: 15px 25px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #04AA6D;
  border: none;
  border-radius: 15px;
  margin: 0 auto;
  margin-bottom: 1.4rem;
}

.button:hover {
  color: #000;
}
 .logout {
  margin-top: 0.7rem;
 }


@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: row;
  }
  .half {
    width: 50%;
  }
  .right {
    margin-right: 0;
  }
  .appname {
    display:block
  }
  .sidebar {
  display: flex;
  flex-direction: column;
  width:20%;
  }
  .editor {
    width: 80%;
  }
}

</style>
