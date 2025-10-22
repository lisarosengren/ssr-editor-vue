<script>
  import DocList from './DocList.vue';
  import { inviteDoc, acceptInvite } from '@/models/docs';
  import { inject } from 'vue';

  export default {
    setup() {
      const userState = inject('userState');
      const invite = inject('invite');
      return {userState, invite };
    },
  //   props: {
  //   user: {
  //     type: Object,
  //     required: true
  //   }
  // },
    data() {
      return {
        // invite: '',
        inviteLink: ''
      };
    },
    async mounted() {
      try {
        console.log(this.userState.user)
        console.log("userdocs here")
      const inviteToken = localStorage.getItem('invite-token');
      // const inviteToken = this.userState.inviteToken;
      if (inviteToken) {
        console.log("there is an invite")
        this.invite = await inviteDoc();
      }
      } catch (e) {
        console.log(e)
        this.$router.push('/fail')
      }
    },
    methods: {
      onClick() {
        // console.log("Clicked")
      },
      async accept() {
        try {
          console.log("i accept")
          console.log("userId: ", this.userState.user._id)
          console.log("docId: ", this.invite.invite.documentId)
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
          this.$router.push('/fail');
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
  <DocList />
      <div class="invite" v-if="invite">
      <h2>Du har en inbjudan:</h2>
      <h3>Användaren {{ invite.invite.inviter }} </h3>
      <p>vill att du medverkar i ett dokument</p>
      <button class="button" @click="accept">Acceptera?</button>
    </div>
</template>

<style scoped>
li {
  list-style-type: none;
}
.invite {
  padding-top: 2rem;
}
</style>
