<script>
  import { getAll } from '@/models/docs';


  export default {
    data() {
      return {
        allDocs: []
      };
    },
    async mounted() {
      this.allDocs = await getAll();
    },
    methods: {
      onClick() {
        console.log("Clicked")
      }
    }
  };

</script>




<template>
  <ul>
    <li v-for="(entry) in allDocs" :key="entry._id">
      <router-link :to="`/${ entry._id }`" @click="onClick">{{ entry.title }}</router-link>
        <button @click="onClick">Test Click</button>
    </li>
  </ul>
</template>

<style scoped>
li {
  list-style-type: none;
}
</style>
