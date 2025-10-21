<script>
  import { getAll } from '@/models/docs';

  export default {
    data() {
      return {
        allDocs: [],
      };
    },
    async mounted() {
      console.log("doclist here")
      try {
        console.log("trying to getAll")
      const result = await getAll();
      console.log("result from getall: ", result)
      this.allDocs = result;
      } catch (e) {
        console.log(e)
        this.$router.push('/fail')
      }
    },
    methods: {
      onClick() {
        // console.log("Clicked")
      }
    }
  };

</script>




<template>
  <h2>Mina dokument:</h2>
  <p v-for="(entry) in allDocs" :key="entry._id">
    <router-link
      v-if="entry && entry._id"
        :to="{
          name: 'DocView',
          params: {
            id: entry._id,
            type: entry.type || 'text'
          }
        }"
        @click="onClick">{{  entry.title  }}
    </router-link>
  </p>
</template>

<style scoped>
li {
  list-style-type: none;

}
</style>
