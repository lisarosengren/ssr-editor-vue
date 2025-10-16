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
  localStorage.removeItem('token')
  localStorage.removeItem('invite-token')
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
  // if (token) {
  //   console.log("found token")
  //   try {
  //     if (inviteToken) {
  //       const sameUser = await checkInvite()
  //       if (!sameUser.loginUser) {
  //         console.log("invited not same as logged in")
  //         localStorage.removeItem('token')
  //         return
  //       }
  //     }
  //     const currentUser = await getUser()
  //     if (currentUser) {
  //       user.value = currentUser
  //       loggedIn.value = true
  //     }
  //   } catch (e) {
  //     console.log("invalid token", e)
  //     localStorage.removeItem('token')
  //   }
  // }
  if (token && inviteToken) {
    const sameUser = await checkInvite();
    console.log(sameUser);
    if (!sameUser.loginUser) {
      console.log("not same user");
      localStorage.removeItem('token');
    }
  }
  if (token) {
    console.log("token found, checking...")
    const currentUser = await getUser();
    console.log(currentUser)
    user.value = currentUser;
    loggedIn.value = true;
  }
});
</script>

<template>
  <header>
  <!--  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="wrapper">
      <RouterLink to="/"><h1>Bobcat Noir</h1></RouterLink>
      <h2>ssr-editor</h2>
<!--      <nav>
        <RouterLink to="/login">Logga in befintlig användare</RouterLink>
        <RouterLink to="/register">Registrera ny användare</RouterLink>
      </nav> -->
    </div>
    <div v-if="loggedIn && user">
      <p>inloggad som: {{  user.email }}</p>
      <button @click="logout">logga ut</button>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 2rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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
