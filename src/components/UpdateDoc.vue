<script>
  import { getOne } from '@/models/docs';
  import { useRoute } from 'vue-router';
  import { io } from "socket.io-client";

  const URL = import.meta.env.VITE_API_URL;
  

  export default {
    data() {
      return {
        socket: null,
        id: null,
        title: null,
        content: null,
      };
    },
    async mounted() {
      const route = useRoute();
      this.id = route.params.id;
      
      try {
        this.socket = io(URL);
        const document = await getOne(this.id);
        this.title = document.title;
        this.content = document.content;
        this.socket.emit("create", this.id);
        this.socket.on("title", (data) => {
          this.title = data;
        });
        this.socket.on("content", (data) => {
          this.content = data;
        });        
       } catch (e) {
        console.error(e);
        this.$router.push('/fail')
      };
    },
    beforeUnmount() { 
      this.socket.disconnect();
    },
    methods: {
      // The method that is called when the user is typing in the field for title or content.
      // The "what" tells if it's the title or the content that is being updated.
      onInput(what) {
        let type = what === "title" ? this.title : this.content;

        let data = {
            _id: this.id,
            input: type
          }
          this.socket.emit(what, data)
      }
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
  <input type="text" v-model="title" @input="onInput('title')" />

  <label for="content">Innehåll</label>
  <textarea v-model="content" @input="onInput('content')"></textarea>

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
