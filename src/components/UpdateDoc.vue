<script>
  import { getOne, mailInvitation } from '@/models/docs';
  import { io } from "socket.io-client";
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
        mailInvite: '',
        errMail: false,
        document: null,
        timeout: null
      };
    },
    watch: {
      '$route.params.id': {
        immediate: true,
        async handler(newId) {
          if (!newId) return;
          this.id = newId;

          try {
            const document= await getOne(newId);
            if (!document) {
              throw new Error("Det gick fel!");
            }
            this.document = document;
            this.title = document.title;
            this.content = document.content;
            
            if (this.socket) {
              this.socket.disconnect();
            }
            this.socket = io(URL, {
              auth: { token: localStorage.getItem('token') }
            });
            this.socket.emit("create", newId);

            this.socket.on("title", (data) => {
              this.title = data;
              clearTimeout(this.timeout); 
              this.timeout = setTimeout(() => {
                this.$emit('doc-created');
                console.log("Nu borde listan uppdateras");
              }, 4000);
            });
            this.socket.on("content", (data) => { this.content = data});
          } catch (e) {
            this.errorState.value = true;
            console.error(e);
          }
        }
      }
    },
    beforeUnmount() {
      if (this.socket) {
        this.socket.disconnect();
      }
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
        if (what === "title") {
          clearTimeout(this.timeout); 
          this.timeout = setTimeout(() => {
            this.$emit('doc-created');
            console.log("Nu borde listan uppdateras");
          }, 4000);
        }

      },
      async onSubmit() {
        const form = this.formRef;
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        console.log("send button!", this.mailInvite);
        try {
          const sentTo = await mailInvitation(this.mailInvite, this.id);
          console.log("mailing: ", sentTo)
          } catch (e) {
            this.errMail = true;
            console.error(e)
          }
          },
    }
  };

</script>




<template>
  <div class="document">

    <div class="editor">
      <label for="title">Titel</label>
      <input type="text" v-model="title" @input="onInput('title')" />

      <label for="content">Innehåll</label>
      <textarea v-model="content" @input="onInput('content')"></textarea>

    </div>
    <div class="sidebar">
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
        <div id="hide" class="err">
          <p>Något har gått fel...</p>
        </div>
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
