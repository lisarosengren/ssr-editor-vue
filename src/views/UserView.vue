<script>
  // import DocList from '@/components/DocList.vue';
  import { getUser } from '@/models/docs';

  export default {
    data() {
      return {
        user: {
          id : null,
          email: ''
        },
      };
    },
    // components: {
    //   DocList,
    // },
    async mounted() {
      console.log(this.user)
      try {
        this.user = await getUser();
        console.log(this.user);
      } catch (e) {
        console.log(e)
        this.$router.push('/fail')
      }
    },

  }
</script>

<template>
  <main>
    <h1>Välkommen {{ user.email }}</h1>
    <h2>Dina dokument:</h2>
  </main>


</template>

<style>

</style>
