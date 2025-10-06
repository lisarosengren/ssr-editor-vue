<script>
  import { updateDoc, getOne, sendCode } from '@/models/docs';
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";

  export default {
    data() {
      return {
        socket: null,
        id: null,
        title: null,
        content: null,   
        output: '',
        editorView: null,
      };
    },
    async mounted() {
      this.id = this.$route.params.id;

      try {
        const document = await getOne(this.id);

        this.id = document._id;
        this.title = document.title;
        this.content = document.content;

        this.editorView = new EditorView({
          doc: this.content,
          extensions: [
            basicSetup,
            javascript(),
            EditorView.updateListener.of(update => {
              if (update.docChanged) {
                this.content = update.state.doc.toString();
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
      }
      }
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
