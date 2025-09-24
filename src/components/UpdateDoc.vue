<script>
  import { update, getOne } from '@/models/docs';

  export default {
    data() {
      return {
        docToUpdate: {}
      };
    },
    async mounted() {
      this.docToUpdate = await getOne();
    }
  };

</script>




<template>
  <form @submit.prevent="onSubmit">
    <label for="title">Titel</label>
    <input type="text" v-model="docToUpdate.title" />

    <label for="content">Innehåll</label>
    <textarea v-model="docToUpdate.content"></textarea>

  </form>
</template>

<style scoped>

</style>
