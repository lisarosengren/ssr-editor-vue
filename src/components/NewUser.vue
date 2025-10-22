<script>
  import { newUser, userLogin } from '@/models/docs';
  import { inject } from 'vue';
  export default {
    setup() {
      const userState = inject('userState');
      return {userState };
    },
    emits: ['register-success'],
    data() {
      return {
        newUserData: {
          email: '',
          password: '',
          inviteToken: localStorage.getItem('invite-token')
        },
      };
    },
    methods: {
      async onSubmit() {
        try {
          const newestUser = await newUser(this.newUserData);
          console.log(newestUser);
          console.log("new user ", newestUser)

          const loginNewUser = await userLogin({
            email: this.newUserData.email,
            password: this.newUserData.password
          });
          localStorage.setItem('token', loginNewUser.token);
          this.$emit('register-success', loginNewUser)
          } catch (e) {
            console.error(e)
        }
      },
    }
  };

</script>
<template>

  <form @submit.prevent="onSubmit">
    <label for="email">E-post</label>
    <input id="email" name="email" v-model="newUserData.email"  />
    <label for="password">Lösenord</label>
    <input id="password" name="password" v-model="newUserData.password"  />
    <input type="submit" name="doit" value="Registrera användare">
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

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
