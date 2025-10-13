<script>
  import { userLogin } from '@/models/docs';

  export default {
    data() {
      return {
        userData: {
          email: '',
          password: ''
        },
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const user = await userLogin(this.userData);
          console.log("user entered: ", user)
          this.$router.push('/user')
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
    <input id="email" name="email" v-model="userData.email" required />
    <label for="password">Lösenord</label>
    <input id="password" name="password" v-model="userData.password" required />
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
