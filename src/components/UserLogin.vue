<script setup>
import { ref } from 'vue';
import { getUser, userLogin } from '@/models/docs';
import { inject } from 'vue';

const userState = inject('userState');
console.log("from UserLogin", userState.loggedIn);

const emit = defineEmits(['login-success'])
const userData = ref({
  email: '',
  password: ''
})

async function onSubmit() {
  try {
    const user = await userLogin(userData.value)
    localStorage.setItem('token', user.token)
    const currentUser = await getUser()
    emit('login-success', currentUser)
    userState.user = currentUser;
    userState.loggedIn = true;
  } catch (e) {
    console.error(e)
  }
}

</script>




<template>

  <form @submit.prevent="onSubmit">
    <label for="email">E-post</label>
    <input id="email" name="email" v-model="userData.email"  />
    <label for="password">Lösenord</label>
    <input id="password" name="password" v-model="userData.password"  />
    <input type="submit" name="doit" value="Logga in">
  </form>
</template>

<style scoped>
.radio {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.radiobutton {
  margin: 0.7rem;
  width: auto;
}


</style>
