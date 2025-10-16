<script setup>
import { ref, inject } from 'vue';
import UserDocs from '@/components/UserDocs.vue';
import UserLogin from '@/components/UserLogin.vue';
import NewUser from '@/components/NewUser.vue';
// import { getUser, checkInvite } from '@/models/docs';
// import { useRoute } from 'vue-router';

const user = inject('user');
const loggedIn = inject('loggedIn');

// const route = useRoute();
// const invited = ref(false);
const register = ref(false);
const login = ref(false);

// onMounted(async () => {
//   const token = localStorage.getItem('token');
//   const inviteToken = route.query.token;
//   if (inviteToken) {
//     invited.value = true;
//     localStorage.setItem('invite-token', inviteToken);
//   }
//   if (token && inviteToken) {
//     const sameUser = await checkInvite();
//     console.log(sameUser);
//     if (!sameUser.loginUser) {
//       console.log("not same user");
//       localStorage.removeItem('token');
//     }
//   }
//   if (token) {
//     const currentUser = await getUser();
//     user.value = currentUser;
//     loggedIn.value = true;
//   }
// });

function handleLogin(loggedInUser) {
  user.value = loggedInUser;
  loggedIn.value = true;
}

</script>

<template>
  <main>
    <UserDocs v-if="loggedIn && user" :user="user" />
    <div v-else>
      <button class="button" @click="login = true; register = false">Logga in</button>
      <button class="button" @click="register = true; login = false">Registrera ny användare</button>
      <UserLogin v-if="login" @login-success="handleLogin" />
      <NewUser v-if="register" @register-success="handleLogin" />
    </div>
  </main>
</template>
