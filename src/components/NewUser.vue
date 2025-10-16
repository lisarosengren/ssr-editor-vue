<script>
  import { newUser } from '@/models/docs';

  export default {
    emits: ['register-success'],
    data() {
      return {
        newUserData: {
          email: '',
          password: '',
          inviteToken: localStorage.getItem('invite-token')
        },
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const user = await newUser(this.newUserData);
          console.log(user);
          console.log("new user ", user)
          this.$emit('register-success', user)
          this.$router.push('/')
          } catch (e) {
            console.error(e)
            this.err = true;
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
