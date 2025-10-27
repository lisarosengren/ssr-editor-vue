<script>
  import DocList from './DocList.vue';
  import { inviteDoc, acceptInvite, getOne } from '@/models/docs';
  import { inject } from 'vue';

  export default {
    emits: ['doc-created'],
    setup() {
      const userState = inject('userState');
      const invite = inject('invite');
      const errorState = inject('errorState'); 
      return {userState, invite, errorState };
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
        console.log("this.invite.invite:", this.invite.invite.documentId)
        try {
          await acceptInvite({
            docId: this.invite.invite.documentId
          });
          const inviteDocument = await getOne(this.invite.invite.documentId);
          this.$router.push({
            name: 'DocView',
            params: {
              id: inviteDocument._id,
              type: inviteDocument.type
            }
          });
          this.invite = null;
          localStorage.removeItem('invite-token');
          this.$emit('doc-created')
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
  <RouterLink class="button create" to="/create">Nytt dokument</RouterLink>
  <DocList @doc-created="$emit('doc-created')"/>
    <div class="invite" v-if="invite">
      <h2>Du har en inbjudan:</h2>
      <h3>Användaren: {{ invite.invite.inviter }} </h3>
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

.create {
  margin: 0;
  min-width: 50%;
  max-width: 100%;
}


</style>
