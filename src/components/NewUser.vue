<script setup>
import { newUser, userLogin, getUser } from '@/models/docs';
import { ref, inject } from 'vue';

const emit = defineEmits(['register-success']);
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

  // export default {
  //   emits: ['register-success'],
  //   setup() {
  //     return {userState };
  //   },
  //   data() {
  //     return {
  //       newUserData: {
  //         email: '',
  //         password: '',
  //         inviteToken: localStorage.getItem('invite-token')
  //       },
  //       // err: false
  //     };
  //   },
  //   methods: {
  //   }
  // };

</script>




<template>

  <form ref="formRef" @submit.prevent="onSubmit">
    <label for="email">E-post</label>
    <input id="email" name="email" type="email" v-model="newUserData.email" required placeholder="example@example.com" />
    <label for="password">Lösenord</label>
    <input id="password" name="password" type="password" v-model="newUserData.password" required />
    <input type="submit" name="doit" value="Registrera användare">
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
