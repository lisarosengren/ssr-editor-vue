<script>
  import { updateDoc, getOne, sendCode } from '@/models/docs';
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";

  export default {
    data() {
      return {
        codeToUpdate: {
          _id: null,
          title: null,
          content: null,
          type: null
        },
        output: '',
        editorView: null,
        err: false,
        update: false,
      };
    },
    async mounted() {
      const id = this.$route.params.id;

      try {
        const document = await getOne(id);

        this.codeToUpdate._id = document._id;
        this.codeToUpdate.title = document.title;
        this.codeToUpdate.content = document.content;

        this.editorView = new EditorView({
          doc: this.codeToUpdate.content,
          extensions: [
            basicSetup,
            javascript(),
            EditorView.updateListener.of(update => {
              if (update.docChanged) {
                this.codeToUpdate.content = update.state.doc.toString();
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
      async onSubmit() {
        try {
          await updateDoc(this.codeToUpdate);
          this.err = false;
          this.update = true;
          setTimeout(() => {
            this.update = false;
          }, 5000);
          } catch (e) {
            console.error(e)
            this.err = true;
          }
          },
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
    <input type="text" v-model="codeToUpdate.title" />

    <label for="content">Innehåll</label>
    <div ref="editor" class="code"></div>

    <input type="submit" name="doit" value="Uppdatera">

  </form>

  <button @click="executeCode">Skicka koden till efo</button>
  <pre>{{  output  }}</pre>

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
