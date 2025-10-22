<script setup>
import { ref } from 'vue';
import { getUser, userLogin } from '@/models/docs';
import { inject } from 'vue';

const userState = inject('userState');
console.log("from UserLogin", userState.loggedIn);

const emit = defineEmits(['login-success']);
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
    console.log("UserLogin here", user)
    localStorage.setItem('token', user.token)
    console.log("Calling getuser to get currentUser")
    const currentUser = await getUser()
    console.log("currentUser", currentUser)
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

  <form ref="formRef" @submit.prevent="onSubmit">
    <label for="email">E-post</label>
    <input id="email" name="email" type="email" v-model="userData.email" required placeholder="example@example.com" />
    <label for="password">Lösenord</label>
    <input id="password" name="password" type="password" v-model="userData.password" required />
    <input type="submit" name="doit" value="Logga in">
  </form>


  <!-- <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
  </div> -->

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

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
