<script>
  import { update } from '@/models/docs';


  export default {
    data() {
      return {
        allDocs: []
      };
    },
    async mounted() {
      this.allDocs = await getAll();
    }
  };

</script>




<template>

  <li v-for="(entry) in allDocs" :key="entry._id">
    <router-link :to="`/${ entry._id }`">{{ entry.title }}</router-link>


  </li>
</template>

<style scoped>
li {
  list-style-type: none;
}
</style>
