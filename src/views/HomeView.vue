<script setup>
import { ref, onMounted } from 'vue';
import UserDocs from '@/components/UserDocs.vue';
import UserLogin from '@/components/UserLogin.vue';
import { getUser } from '@/models/docs';

const loggedIn = ref(false);
const user = ref(null);

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const currentUser = await getUser();
    if (currentUser) {
      user.value = currentUser;
      loggedIn.value = true;
      console.log("logged in")
    }
  }
});

function handleLogin(loggedInUser) {
  user.value = loggedInUser;
  loggedIn.value = true;
}
</script>

<template>
  <main>
    <UserDocs v-if="loggedIn" :user="user" />
    <UserLogin v-else @login-success="handleLogin" />
  </main>
</template>
