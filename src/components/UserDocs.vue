<script>
  import DocList from './DocList.vue';
  import { inviteDoc, acceptInvite } from '@/models/docs';

  export default {
    props: {
    user: {
      type: Object,
      required: true
    }
  },
    data() {
      return {
        invite: '',
        inviteLink: ''
      };
    },
    async mounted() {
      try {
        console.log(this.user)
        console.log("userdocs here")
      const inviteToken = localStorage.getItem('invite-token');
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
          await acceptInvite({
            userId: this.user._id,
            docId: this.invite.invite.documentId
          });
          localStorage.removeItem('invite-token');

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
  <h1>Välkommen {{ user.email }}</h1>
  <RouterLink to="/create">Nytt dokument</RouterLink>
  <DocList />
      <div v-if="invite">
      <h2>Du har en inbjudan:</h2>
      <p> {{ invite.invite.inviter }} bjuder in dig att medverka i dokumentet {{  invite.invite.documentId }}</p>
      <button @click="accept">Tacka ja och börja medverka (eller motverka)</button>
    </div>
</template>

<style scoped>
li {
  list-style-type: none;
}
</style>
