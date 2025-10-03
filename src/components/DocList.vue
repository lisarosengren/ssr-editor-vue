<script>
  import { getAll } from '@/models/docs';


  export default {
    data() {
      return {
        allDocs: []
      };
    },
    async mounted() {
      try {
      this.allDocs = await getAll();
      } catch (e) {
        console.log(e)
        this.$router.push('/fail')
      }
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
      <router-link
        :to="{
          name: 'DocView',
          params: {
            id: entry._id,
            type: entry.type || 'text'
          }
        }"
        @click="onClick">{{  entry.title  }}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
li {
  list-style-type: none;
}
</style>
