<script>
  import { newDoc } from '@/models/docs';

  export default {
    data() {
      return {
        newDocData: {},
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const id = await newDoc(this.newDocData);
          this.$router.push(`/${ id }`)
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
    <input type="text" v-model="newDocData.title" />

    <label for="content">Innehåll</label>
    <textarea v-model="newDocData.content"></textarea>
    
    <input type="submit" name="doit" value="Skapa">
  
  </form>

  
  <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
  </div>

</template>

<style scoped>

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
