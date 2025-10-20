<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, provide, onMounted, watch } from 'vue'
import { getUser, checkInvite } from './models/docs'
import UserDocs from './components/UserDocs.vue'
import UserLogin from './components/UserLogin.vue'
import NewUser from './components/NewUser.vue'

const user = ref(null);
const loggedIn = ref(false);
const login = ref(false);
const register = ref(false);

provide('user', user)
provide('loggedIn', loggedIn)


const route = useRoute()

watch(
  () => route.query.token,
  (newToken) => {
    if (newToken) {
      console.log('found invite token', newToken)
      localStorage.setItem('invite-token', newToken)
    }
  },
  { immediate: true }
)

function handleLogin(loggedInUser) {
  user.value = loggedInUser;
  console.log("after login", user.value);
  loggedIn.value = true;
  login.value = false;
  register.value = false;
}

function logout() {
  console.log("logging out")
  localStorage.removeItem('token')
  localStorage.removeItem('invite-token')
  console.log("should be empty", localStorage)
  user.value = null
  loggedIn.value = false
  window.location.href = '/'// full reload to reset
}

// const user = ref(null)
// const loggedIn = ref(false)


// provide = makes variables and functions available in other views (use inject)
// provide('user', user)
// provide('loggedIn', loggedIn)
// provide('logout', logout)

onMounted(async () => {
  console.log("user: ", user)
  const inviteToken = route.query.token;
  const token = localStorage.getItem('token');
  if (inviteToken) {
    console.log("found invite token")
    localStorage.setItem('invite-token', inviteToken);
  }

  if (token && inviteToken) {
    console.log("both token and invite found")
    const sameUser = await checkInvite();
    console.log(sameUser);
    if (sameUser.loginUser == false) {
      console.log("not same user");
      localStorage.removeItem('token');
    }
  }
  if (token) {
    console.log("token found, calling getUser")
    const currentUserObj = await getUser();
    console.log("current user", currentUserObj.data.user)
    user.value = currentUserObj.data.user;
    console.log("user.value: ", user.value)
    console.log("user.value.email", user.value.email)
    loggedIn.value = true;
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
  <div v-if="loggedIn && user" class="right half">
    <p>inloggad som: {{  user.email }}</p>
    <button class="button" @click="logout">logga ut</button>
  </div>
  </header>

  <main>
    <div class="sidebar">
        <UserDocs v-if="loggedIn && user" :user="user" />
      <div v-else>
        <button class="button" @click="login = true; register = false">Logga in</button>
        <button class="button" @click="register = true; login = false">Registrera ny användare</button>
        <UserLogin v-if="login" @login-success="handleLogin" />
        <NewUser v-if="register" @register-success="handleLogin" />
      </div>
    </div>

    <div class="editor">
      <RouterView />
    </div>


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
