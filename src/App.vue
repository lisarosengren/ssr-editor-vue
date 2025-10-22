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

provide('invite', invite);
provide('userState', userState);
provide('documents', documents);

function handleError(){
  err.value = true;
}
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
  console.log("after login", userState.user);

  const inviteToken = localStorage.getItem('invite-token');
  if (inviteToken) {
    console.log("invite token found in login function, send to check");
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
  console.log("logging out")
  localStorage.removeItem('token')
  localStorage.removeItem('invite-token')
  console.log("should be empty", localStorage)
  userState.user = null
  userState.loggedIn = false
  window.location.href = '/'// full reload to reset
}

watch(
  () => route.query.token,
  async (urlToken) => {
    if (!urlToken) return;
    console.log("found invite token", urlToken);
    localStorage.setItem('invite-token', urlToken);
    userState.inviteToken = urlToken;

    const token = localStorage.getItem('token');
    if (token) {
      console.log("both token and invite, check");
      const sameUser = await checkInvite();
      console.log("checked invite result", sameUser)
      if (sameUser == false) {
        alert(`You are trying to access an invite that was sent to another user.
              Please log in with the correct user information.
              Loggin you out.`);
        console.log("not same");
        logout();
        return;
      }
      try {
        invite.value = await inviteDoc();
        console.log("invite - ", invite.value);
      } catch (err) {
        console.error("failed to fetch invite", err);
      }
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // console.log("user: ", userState.user)
  // console.log("userState ", userState)
  // const inviteToken = route.query.token;
  const token = localStorage.getItem('token');
  if (token) {
    console.log("token found, calling getUser")
    const currentUser = await getUser();
    console.log("current user", currentUser)
    userState.user = currentUser;
    console.log("userState: ", userState)
    // console.log("user.value.email", user.value.email)
    userState.loggedIn = true;

  // if (inviteToken) {
  //   console.log("found invite token")
  //   localStorage.setItem('invite-token', inviteToken);
  // }

  // if (token && inviteToken) {
  //   console.log("both token and invite found")
  //   const sameUser = await checkInvite();
  //   console.log("return from checkinvite: ", sameUser);
  // }
    // if (inviteToken) {
    //   console.log("token and invite, checking")
    //   const sameUser = await checkInvite();
    //   console.log("checked invite result", sameUser)
    // }
    // if (!sameUser.loginUser) {
    //   console.log("not same user loggin gout");
    //   logout();
    // }

    documents.value = await getAll();
    console.log("did i get all?");
  }
  });
</script>

<template>
  <header class="column">
  <!--  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

  <div class="left half appname">
    <RouterLink to="/"><h1>Bobcat Noir</h1><h1>ssr-editor</h1></RouterLink>
<!--      <nav>
      <RouterLink to="/login">Logga in befintlig användare</RouterLink>
      <RouterLink to="/register">Registrera ny användare</RouterLink>
    </nav> -->
  </div>
  <div v-if="userState.loggedIn && userState.user" class="right half">
    <p>inloggad som: {{  userState.user.email }}</p>
    <button class="button" @click="logout">logga ut</button>
  </div>
  </header>

  <main v-if="!err">
    <div class="sidebar">
        <!--<UserDocs v-if="loggedIn && user" :user="user" />-->
        <UserDocs v-if="userState.loggedIn" @error="handleError"/>
      <div v-else>
        <button class="button" @click="login = true; register = false">Logga in</button>
        <button class="button" @click="register = true; login = false">Registrera ny användare</button>
        <UserLogin v-if="login" @login-success="loginUser" />
        <NewUser v-if="register" @register-success="loginUser" />
      </div>
    </div>

    <div class="editor">
      <RouterView @doc-created="reloadDocs" @error="handleError"/>
    </div>
  </main>

  <main v-else>
    <FailComponent @back="resetError"/>

  </main>

</template>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 2rem;
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
.sidebar {
  display: flex;
  flex-direction: row;
  max-width:100%;
}
main {
  display: flex;
  flex-direction: row;
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
nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.button {
  display: inline-block;
  padding: 15px 25px;
  /* font-size: 24px; */
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #04AA6D;
  border: none;
  border-radius: 15px;
  margin: 1.4rem;
}

.button:active {
  box-shadow: 0 5px #666;
  transform: translateY(4px);
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
/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
