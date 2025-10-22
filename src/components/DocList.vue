<script>
  // import { getAll } from '@/models/docs';
  import { inject } from 'vue';

  export default {
    setup() {
      const userState = inject('userState');
      const documents = inject('documents');
      return {userState, documents };
    },
    // async mounted() {
    //   try {
    //     const result = await getAll();
    //     this.allDocs = result;
    //   } catch (e) {
    //     console.log(e)
    //     this.$emit('error', e);
    //   }
    // },
    // methods: {
    //   async onClick() {
    //     // const res = await getAll();
    //     // this.allDocs = res;
    //     console.log("Clicked")
    //   }
    // }
  };

</script>




<template>
  <h2>Mina dokument:</h2>
  <p v-for="(entry) in documents" :key="entry._id">
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
