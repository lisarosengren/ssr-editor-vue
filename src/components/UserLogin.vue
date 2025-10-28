<script setup>
import { ref } from 'vue';
import { getUser, userLogin } from '@/models/docs';
import { inject } from 'vue';

const userState = inject('userState');

console.log("from UserLogin", userState.loggedIn);

const emit = defineEmits(['login-success', 'changed-mind']);
const formRef = ref(null);

const userData = ref({
  email: '',
  password: ''
})

// const err = ref(false)

async function onSubmit() {
  const form = formRef.value;

  if (!form.checkValidity()) {
    form.reportValidity()
    return;
  }
  try {
    const user = await userLogin(userData.value)

    localStorage.setItem('token', user.token)
    const currentUser = await getUser()

    emit('login-success', currentUser)
    userState.user = currentUser;
    userState.loggedIn = true;
  } catch (e) {
    console.log("e", e)
    // err.value = true
    localStorage.removeItem('token')
    alert(`${e.message}`)
  }
}

</script>

<template>

  <form class="login-register" ref="formRef" @submit.prevent="onSubmit">
    <fieldset>
      <legend>Logga in</legend>
        <label for="email">E-post: </label><br>
        <input id="email" name="email" type="email" v-model="userData.email" required placeholder="example@example.com" />
        <br>
        <label for="password">Lösenord: </label><br>
        <input id="password" name="password" type="password" v-model="userData.password" required /><br>
        <input type="submit" name="doit" value="Logga in" class="button">
        <p @click="$emit('changed-mind')" class="register-login-link">Skapa konto</p>
    </fieldset>
  </form>
</template>

<style scoped>



</style>
