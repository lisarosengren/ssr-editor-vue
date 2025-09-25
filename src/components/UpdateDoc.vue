<script>
  import { updateDoc, getOne } from '@/models/docs';
  import { useRoute } from 'vue-router';

  export default {
    data() {
      return {
        docToUpdate: {
          _id: null,
          title: null,
          content: null
        },
        err: false,
        update: false
      };
    },
    async mounted() {
      const route = useRoute();
      const id = route.params.id;
      
      try {
        const document = await getOne(id);
        this.docToUpdate._id = document._id;
        this.docToUpdate.title = document.title;
        this.docToUpdate.content = document.content;

       } catch (e) {
        console.error(e);
        this.$router.push('/fail')
      }
    },
    methods: {
      async onSubmit() {
        try {
          await updateDoc(this.docToUpdate);
          this.err = false;
          this.update = true;
          setTimeout(() => {
            this.update = false;
          }, 5000);
          } catch (e) {
            console.error(e)
            this.err = true;
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
    
    <input type="submit" name="doit" value="Uppdatera">
  
  </form>

  <div v-if="update">
    <div id="hide" class="updated">
      <p>Uppdaterat!</p>
    </div>
  </div>

  <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
  </div>


</template>

<style scoped>

.updated {
  background-color: rgb(53, 217, 53);
  padding: 0.5rem;
  text-align: center;
}

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
