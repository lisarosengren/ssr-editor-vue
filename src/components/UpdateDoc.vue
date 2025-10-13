<script>
  import { getOne } from '@/models/docs';
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
      this.id = this.$route.params.id;

      try {
        this.socket = io(URL, {
          auth: {
            token: localStorage.getItem('token')
          }
        });
        const document = await getOne(this.id);
        this.title = document.title;
        this.content = document.content;
        this.socket.emit("create", this.id); // join a room
        this.socket.on("title", (data) => { // listens for title update
          this.title = data;
        });
        this.socket.on("content", (data) => { // listens for content update
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
      onInput(what) {
      // This method that is called when the user is typing in the field for title or content.
      // The "what" tells if it's the title or the content that is being updated.
        let type = what === "title" ? this.title : this.content;

        let data = {
            _id: this.id,
            input: type
          }
          this.socket.emit(what, data)
      }
    }
  };

</script>




<template>

  <label for="title">Titel</label>
  <input type="text" v-model="title" @input="onInput('title')" />

  <label for="content">Innehåll</label>
  <textarea v-model="content" @input="onInput('content')"></textarea>

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
