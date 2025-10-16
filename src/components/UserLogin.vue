<script setup>
import { ref } from 'vue';
import { getUser, userLogin } from '@/models/docs';

const emit = defineEmits(['login-success'])
const userData = ref({
  email: '',
  password: ''
})

const err = ref(false)

async function onSubmit() {
  try {
    const user = await userLogin(userData.value)
    localStorage.setItem('token', user.token)
    const currentUser = await getUser()
    emit('login-success', currentUser)
  } catch (e) {
    console.error(e)
    err.value = true
  }
}
  // export default {
  //   emits: ['login-success'],
  //   data() {
  //     return {
  //       userData: {
  //         email: '',
  //         password: '',
  //         inviteToken: localStorage.getItem('invite-token')
  //       },
  //       err: false
  //     };
  //   },
  //   methods: {
  //     async onSubmit() {
  //       try {
  //         const user = await userLogin(this.userData);
  //         // localStorage.setItem('token', user.token);
  //         const currentUser = await getUser();
  //         console.log("logging in: ", user);
  //         this.$emit('login-success', currentUser);
  //         // this.$router.push('/')
  //         } catch (e) {
  //           console.error(e)
  //           this.err = true;
  //         }
  //         },
  //     }
  //   };

</script>




<template>

  <form @submit.prevent="onSubmit">
    <label for="email">E-post</label>
    <input id="email" name="email" v-model="userData.email"  />
    <label for="password">Lösenord</label>
    <input id="password" name="password" v-model="userData.password"  />
    <input type="submit" name="doit" value="Logga in">
  </form>


  <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
  </div>

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
