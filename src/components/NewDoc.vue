<script>
  import { newDoc } from '@/models/docs';
  import { inject } from 'vue';

  export default {
    emits: ['doc-created'],
    setup() {
    const userState = inject('userState');
    return {userState };
    },
    data() {
      return {
        newDocData: {
          title: '',
          type: null,
        },
        err: false
      };
    },
    methods: {
      async onSubmit() {
        try {
          const res = await newDoc(this.newDocData);
          const id = res.insertedId;
          this.$emit('doc-created');
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
    <div class="form">
        <label for="title">Titel</label>
        <input type="text" v-model="newDocData.title" id="title" required />
        <label for="type">Dokumenttyp</label>
        <select v-model="newDocData.type" id="type">
          <option>text</option>
          <option>code</option>
        </select>
    </div>
    <div>
      <input class="button" type="submit" name="doit" value="Spara">

    </div>

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
.column {
  display: flex;
  flex-direction: column;
}
.form {
  padding: 1rem;
}
.button {
  width: auto;
}
@media (min-width: 1024px) {
  .column {
    flex-direction: row;
  }
}
</style>
