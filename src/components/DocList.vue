<script>
  import { getAll } from '@/models/docs';

  export default {
    emits: ['error'],
    data() {
      return {
        allDocs: [],
      };
    },
    async mounted() {
      console.log("doclist here")
      try {
        const result = await getAll();
        this.allDocs = result;
      } catch (e) {
        console.log(e)
        this.$emit('error', e);
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
