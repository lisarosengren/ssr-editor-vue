<script setup>
import { newUser, userLogin, getUser } from '@/models/docs';
import { ref, inject } from 'vue';

const emit = defineEmits(['register-success', 'changed-mind']);
const userState = inject('userState');
const formRef = ref(null);

const newUserData = ref({
  email: '',
  password: '',
  inviteToken: localStorage.getItem('invite-token')
});

async function onSubmit() {
  const form = formRef.value;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  try {
    const newestUser = await newUser(newUserData.value);
    console.log(newestUser);
    console.log("new user ", newestUser)

    const loginNewUser = await userLogin({
      email: newUserData.value.email,
      password: newUserData.value.password
    });
    localStorage.setItem('token', loginNewUser.token);
    const currentUser = await getUser();
    emit('register-success', currentUser);
    userState.user = currentUser;
    userState.loggedIn = true
    // this.$router.push('/')
    } catch (e) {
      console.error("e:", e)
      // this.err = true;
      alert(`${e.message}`)
  }
}

</script>
<template>

  <form class="login-register" ref="formRef" @submit.prevent="onSubmit">
    <fieldset>
      <legend>Skapa konto</legend>
      <label for="email">E-post:</label><br>
      <input id="email" name="email" type="email" v-model="newUserData.email" required placeholder="example@example.com" />
      <br>
      <label for="password">Lösenord:</label><br>
      <input id="password" name="password" type="password" v-model="newUserData.password" required />
      <br>
      <input class="button register" type="submit" name="doit" value="Skapa">
      <p class="logging-in">*Du kommer att loggas in automatiskt</p>
      <p @click="$emit('changed-mind')" class="register-login-link">Logga in</p>
    </fieldset>
  </form>

</template>

<style scoped>

.logging-in {
  font-style: italic;
  font-size: 0.7rem;
  margin-top: 0.7rem;
}

.register {
  margin-bottom: 0;
}

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
