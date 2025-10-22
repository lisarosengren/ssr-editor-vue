<script>
  import DocList from './DocList.vue';
  import { inviteDoc, acceptInvite } from '@/models/docs';
  import { inject } from 'vue';

  export default {
    emits: ['doc-created'],
    setup() {
      const userState = inject('userState');
      const invite = inject('invite');
      return {userState, invite };
    },
    created() {
      this.errorState = inject('errorState');
    },
    data() {
      return {
        err: false,
        inviteLink: ''
      };
    },
    async mounted() {
      try {
        console.log(this.userState.user)
        console.log("userdocs here")
      const inviteToken = localStorage.getItem('invite-token');
      if (inviteToken) {
        console.log("there is an invite")
        this.invite = await inviteDoc();
      }
      } catch (err) {
        console.log(err)
        this.errorState.value = true;
      }
    },
    methods: {
      onClick() {
        // console.log("Clicked")
      },
      async accept() {
        try {
          await acceptInvite({
            docId: this.invite.invite.documentId
          });

          localStorage.removeItem('invite-token');
          console.log(localStorage)

          this.$router.push({
            name: 'DocView',
            params: {
              id: this.invite.invite.documentId,
              type: 'text'
            }
          });
        } catch (err) {
          console.log("Failed to accept, ", err);
          this.err = true;
        }
      }
    },
    components: {
      DocList
    }
  };

</script>




<template>
  <!-- <h1>Välkommen {{ user.email }}</h1> -->
  <RouterLink to="/create">Nytt dokument</RouterLink>
  <DocList @doc-created="$emit('doc-created')"/>
    <div class="invite" v-if="invite">
      <h2>Du har en inbjudan:</h2>
      <h3>Användaren {{ invite.invite.inviter }} </h3>
      <p>vill att du medverkar i ett dokument</p>
      <button class="button" @click="accept">Acceptera?</button>
      <div v-if="err">
        <div id="hide" class="err">
          <p>Något har gått fel...</p>
        </div>
      </div>
    </div>
</template>

<style scoped>
li {
  list-style-type: none;
}
.err {
  background-color: rgb(236, 109, 109);
}
.invite {
  padding-top: 2rem;
}
</style>
