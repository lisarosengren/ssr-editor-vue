<script>
  import { newDoc } from '@/models/docs';

  export default {
    data() {
      return {
        newDocData: {
          title: '',
          content: '',
          type: null
        },
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const id = await newDoc(this.newDocData);
          this.$router.push(`/${ id }/${ this.newDocData.type}`)
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
    <input type="text" v-model="newDocData.title" required />
    <div class="radio">
      <input class="radiobutton" type="radio" id="code-mode" value="code" name="type" v-model="newDocData.type" required/>
      <label for="code-mode">code-mode</label>
    </div>
    <div class="radio">
      <input class="radiobutton" type="radio" id="text" value="text" name="type" v-model="newDocData.type" />
      <label for="text">text</label>
    </div>

    <input type="submit" name="doit" value="Spara">

  </form>


  <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
  </div>

</template>

<style scoped>
.radio {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.radiobutton {
  margin: 0.7rem;
  width: auto;
}

.err {
  background-color: rgb(235, 120, 120);
  padding: 0.5rem;
  text-align: center;
}

</style>
