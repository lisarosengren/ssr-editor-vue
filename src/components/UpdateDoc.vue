<script>
  import { updateDoc, getOne } from '@/models/docs';
  import { useRoute } from 'vue-router';
  import { socket } from '@/socket';

  export default {
    data() {
      return {
        id: null,
        title: null,
        content: null,
        err: false,
        update: false
      };
    },
    async mounted() {
      const route = useRoute();
      this.id = route.params.id;
      
      try {
        const document = await getOne(this.id);
        this.title = document.title;
        this.content = document.content;
        socket.emit("create", this.id);
        


       } catch (e) {
        console.error(e);
        this.$router.push('/fail')
      };
    },
    methods: {

      // This is an old one, for when the submit button was still alive.
      // async onSubmit() {
      //   try {
      //     await updateDoc(this.docToUpdate);
      //     this.err = false;
      //     this.update = true;
      //     setTimeout(() => {
      //       this.update = false;
      //     }, 5000);
      //     } catch (e) {
      //       console.error(e)
      //       this.err = true;
      //     }
      //     }
      }
    };

</script>




<template>

  <label for="title">Titel</label>
  <input type="text" v-model="title" />

  <label for="content">Innehåll</label>
  <textarea v-model="content"></textarea>

<!--
This is from when we had a button to save. Maybe we'll put in some error handling later...

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
-->

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
