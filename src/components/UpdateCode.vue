<script>
  import { getOne, sendCode, mailInvitation } from '@/models/docs';
  import { io } from "socket.io-client";
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { inject, ref } from 'vue';

  const URL = import.meta.env.VITE_API_URL;

  export default {
    setup() {
      const userState = inject('userState');
      const formRef = ref(null);
      return {userState, formRef};
    },
    created() {
      this.errorState = inject('errorState');
    },
    data() {
      return {
        socket: null,
        id: null,
        title: null,
        content: null,
        output: '',
        mailInvite: '',
        editorView: null,
        fromSocket: false,
        document: null,
        errMail: false,
        sentMail: false,
        messageTimeout: null,
      };
    },
    watch: {
      '$route.params.id': {
        immediate: true,
        async handler(newId) {
          if (!newId) return;

          this.id = newId;

          try {
            const doc = await getOne(this.id);
            if (!doc) {
              throw new Error("Det gick fel!");
            }
            this.document = doc;
            this.title = doc.title;
            this.content = doc.content;

            if (this.socket) {
              this.socket.disconnect();
            }
            this.socket = io(URL, {
              auth: { token: localStorage.getItem('token') }
            });

            this.socket.emit("create", this.id);

            this.socket.on("title", (data) => {
              this.title = data;
            });

            this.socket.on("content", (data) => {
              this.fromSocket = true;
              this.editorView.dispatch({
                changes: { from: 0, to: this.editorView.state.doc.length, insert: data },
                selection: { anchor: data.length }
              });
            });

            this.$nextTick(() => {
              if (this.editorView) {
                this.editorView.destroy();
              }
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
            });
          } catch (e) {
            console.error(e);
            this.errorState.value = true;
          }
        }
      }
    },
    beforeUnmount() {
      if (this.socket) {
      this.socket.disconnect();
      }
      if (this.editorView) {
        this.editorView.destroy();
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
      },
      onInput(what) {
      // This method is called when the user is typing in the field for title or content.
      // The "what" tells if it's the title or the content that is being updated.
        let type = what === "title" ? this.title : this.content;

        let data = {
            _id: this.id,
            input: type
          }
          this.socket.emit(what, data)
      },
      async onSubmit() {
        const form = this.formRef;
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        console.log("send button!", this.mailInvite);
        this.errMail = false;
        this.sentMail = false;
        if (this.messageTimeout) {
          clearTimeout(this.messageTimeout);
        }
        try {
          const sentTo = await mailInvitation(this.mailInvite, this.id);
          console.log("mailing: ", sentTo)
          this.sentMail = true;
          this.messageTimeout = setTimeout(() => {
            this.sentMail = false;
          }, 3000)
        } catch (e) {
            this.errMail = true;
            console.error(e)
            this.messageTimeout = setTimeout(() => {
              this.errMail = false;
            }, 4000);
          }
        },
    }
};

</script>




<template>
  <div class="document">

    <div class="editor">
    <form @submit.prevent="onSubmit">
      <label for="title">Titel</label>
      <input type="text" v-model="title" @input="onInput('title')" />

      <label for="content">Innehåll</label>
      <div ref="editor" class="code"></div>

    </form>
    </div>
    <div class="sidebar">
      <button @click="executeCode">Skicka koden till efo</button>
      <pre>{{  output  }}</pre>

      <div v-if="document && document.users" >
        <h3>Detta dokument kan användas av:</h3>
        <p v-for="(user) in document.users" :key="user.email">{{ user.email }}</p>
      </div>
      <form ref="formRef" @submit.prevent="onSubmit">
        <label for="mailInvite">Skicka inbjudan att medverka:</label>
        <input type="email" id="mailInvite" name="mailInvite" v-model="mailInvite" />
        <input type="submit" name="doit" value="Skicka">
      </form>
      <div v-if="errMail">
        <div class="err">
          <p>Något har gått fel...</p>
        </div>
      </div>
      <div v-if="sentMail" class="updated">
        <p>Inbjudan skickad!</p>
      </div>



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
.document {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.editor {
  width: 75%;
  padding-right: 2rem;
}
.sidebar {
  width: 25%;
  padding-left: 2rem;
}

</style>
