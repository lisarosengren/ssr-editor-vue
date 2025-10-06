<script>
  import { getOne, sendCode } from '@/models/docs';
  import { io } from "socket.io-client";
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";

  const URL = import.meta.env.VITE_API_URL;

  export default {
    data() {
      return {
        socket: null,
        id: null,
        title: null,
        content: null,   
        output: '',
        editorView: null,
        fromSocket: false,
      };
    },
    async mounted() {
      this.id = this.$route.params.id;

      try {
        this.socket = io(URL)
        const document = await getOne(this.id);
        this.id = document._id;
        this.title = document.title;
        this.content = document.content;
        // The room
        this.socket.emit("create", this.id);
        // Listens to sockets with title updates. Updates the title. 
        this.socket.on("title", (data) => {
          this.title = data;
        });
        this.socket.on("content", (data) => {
          // Raises a flag that the update is from another user
          this.fromSocket = true;
          this.editorView.dispatch({
            changes: {from: 0, to: this.editorView.state.doc.length, insert: data},
            // Moves the cursor to the end of the document
            selection: {anchor: data.length}
          });      
        });


        this.editorView = new EditorView({
          doc: this.content,
          extensions: [
            basicSetup,
            javascript(),
            EditorView.updateListener.of(update => {
              if (update.docChanged) {
                this.content = update.state.doc.toString();
                if (!this.fromSocket) {
                  this.onInput("content");
                }
                // Make sure the "other user" flag is not raised.
                this.fromSocket = false;
              }
            })
          ],
          parent: this.$refs.editor
        });
       } catch (e) {
        console.error(e);
        this.$router.push('/fail')
      }
    },
    beforeUnmount() { 
      this.socket.disconnect();
    },
    methods: {
      async executeCode() {
        console.log('calling execution');
        try {
          const codeString = this.editorView.state.doc.toString();
          this.output = await sendCode(codeString);
        } catch (e) {
          this.output = 'Någonting blev fel...';
          console.log(e);
        }
      },
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
    },
  };

</script>




<template>


  <form @submit.prevent="onSubmit">
    <label for="title">Titel</label>
    <input type="text" v-model="this.title" />

    <label for="content">Innehåll</label>
    <div ref="editor" class="code"></div>

  </form>

  <button @click="executeCode">Skicka koden till efo</button>
  <pre>{{  output  }}</pre>


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
