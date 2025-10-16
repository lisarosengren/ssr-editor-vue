<script>
  import { getAll } from '@/models/docs';

  export default {
    data() {
      return {
        allDocs: [],
      };
    },
    async mounted() {
      try {
      const result = await getAll();
      this.allDocs = result.data.documentList;
      console.log(result)
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
  <ul>
    <li v-for="(entry) in allDocs" :key="entry._id">
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
    </li>
  </ul>
</template>

<style scoped>
li {
  list-style-type: none;

}
</style>
