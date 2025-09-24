<script>
  import { updateDoc, getOne } from '@/models/docs';
import { useRoute } from 'vue-router';

  export default {
    data() {
      return {
        docToUpdate: {}
      };
    },
    async mounted() {
      const route = useRoute();
      const id = route.params.id;
      this.docToUpdate = await getOne(id);
    },
    methods: {
      async onSubmit() {
        try {
          const res = await updateDoc(this.docToUpdate);
          console.log(res);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

</script>




<template>


  <form @submit.prevent="onSubmit">
    <label for="title">Titel</label>
    <input type="text" v-model="docToUpdate.title" />

    <label for="content">Innehåll</label>
    <textarea v-model="docToUpdate.content"></textarea>
    
    <input type="submit" name="doit" value="Create">
  
  </form>
</template>

<style scoped>

</style>
