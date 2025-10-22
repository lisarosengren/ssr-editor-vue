<script>
  // import { getAll } from '@/models/docs';

  export default {
    data() {
      return {
        // allDocs: [],
      };
    },
    async mounted() {
      console.log("userlist here")
      // try {
        // console.log("trying to getAll")
      // const result = await getAll();
      // console.log("result from getall: ", result)
  //     this.allDocs = result;
  //     } catch (e) {
  //       console.log(e)
  //       this.$router.push('/fail')
  //     }
  //   },
  //   methods: {
  //     onClick() {
  //       // console.log("Clicked")
  //     }
    }
  };

</script>




<template>
      <form @submit.prevent="onSubmit">
      <label for="mailInvite">Skicka inbjudan att medverka:</label>
      <input type="email" id="mailInvite" name="mailInvite" v-model="mailInvite" />
      <input type="submit" name="doit" value="Skicka">
    </form>
    <div v-if="document && document.users" >
      <h3>Detta dokument kan användas av:</h3>
      <p v-for="(user) in document.users" :key="user.email">{{ user.email }}</p>
    </div>

</template>

<style scoped>
li {
  list-style-type: none;

}
</style>
