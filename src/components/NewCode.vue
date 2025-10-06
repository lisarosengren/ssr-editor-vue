<script>
  import { newDoc } from '@/models/docs';
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";

  export default {
    data() {
      return {
        newDocData: {
          title: '',
          content: '',
          type: 'code'
        },
        err: false
      };
    },
    mounted() {
      this.editorView = new EditorView({
        doc: '',
        extensions: [basicSetup, javascript()],
        parent: this.$refs.editor
      })
    },
    methods: {
      async onSubmit() {
        console.log("ÖH");
        console.log(this.newDocData.type);
        try {
          this.newDocData.content = this.editorView.state.doc.toString();
          const id = await newDoc(this.newDocData);
          this.$router.push(`/${ id }/${ this.newDocData.type }`)
          } catch (e) {
            console.error(e)
            this.err = true;
          }
          }
      }
    };

</script>




<template>

<div>
  <label for="title">Titel</label>
  <input type="text" v-model="newDocData.title" />

  <label for="editor">Innehåll</label>
  <div ref="editor" class="code"></div>

  <input type="submit" value="Spara" @click="onSubmit" />

  <div v-if="err">
    <div id="hide" class="err">
      <p>Något har gått fel...</p>
    </div>
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
