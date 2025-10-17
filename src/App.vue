<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, provide, onMounted, watch } from 'vue'
import { getUser, checkInvite } from './models/docs'

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
const user = ref(null)
const loggedIn = ref(false)

function logout() {
  console.log("logging out")
  localStorage.removeItem('token')
  localStorage.removeItem('invite-token')
  console.log("should be empty", localStorage)
  user.value = null
  loggedIn.value = false
  window.location.href = '/'// full reload to reset
}

// provide = makes variables and functions available in other views (use inject)
provide('user', user)
provide('loggedIn', loggedIn)
provide('logout', logout)

onMounted(async () => {
  console.log("user: ", user)
  const inviteToken = route.query.token;
  const token = localStorage.getItem('token');
  if (inviteToken) {
    console.log("found invite token")
    localStorage.setItem('invite-token', inviteToken);
  }

  if (token && inviteToken) {
    const sameUser = await checkInvite();
    console.log(sameUser);
    if (!sameUser.loginUser) {
      console.log("not same user");
      localStorage.removeItem('token');
    }
  }
  if (token) {
    console.log("token found, calling getUser")
    const currentUser = await getUser();
    console.log(currentUser)
    user.value = currentUser;
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

  <RouterView />
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
