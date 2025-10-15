<script>
  import DocList from './DocList.vue';

  export default {
    props: {
    user: {
      type: Object,
      required: true
    }
  },
    data() {
      return {
        invites: '',
      };
    },
    async mounted() {
      try {
        console.log(this.user)
        console.log("userdocs here")
      const inviteToken = localStorage.getItem('invite-token');
      if (inviteToken) {
        this.invites = "link to document here"
      }
      } catch (e) {
        console.log(e)
        this.$router.push('/fail')
      }
    },
    methods: {
      onClick() {
        // console.log("Clicked")
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
      <div>
      <h3>invitations:</h3>
      <p> {{ invites }}</p>
    </div>
</template>

<style scoped>
li {
  list-style-type: none;
}
</style>
