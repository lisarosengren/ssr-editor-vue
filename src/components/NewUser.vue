<script>
  import { newUser } from '@/models/docs';

  export default {
    data() {
      return {
        newUserData: {
          email: '',
          password: ''
        },
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const id = await newUser(this.newUserData);
          console.log(id)
          // this.$router.push(`/user/${ id }`)
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
    <input id="email" name="email" v-model="newUserData.email" required />
    <label for="password">Lösenord</label>
    <input id="password" name="password" v-model="newUserData.password" required />
    <input type="submit" name="doit" value="Spara">
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
