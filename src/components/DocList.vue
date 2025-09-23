<script>
  import { getAll } from '@/models/docs';

  export default {
    data() {
      return {
        allDocs: []
      };
    },
    async mounted() {
      this.allDocs = await getAll();
    }
  };

</script>




<template>
  <li v-for="(entry) in allDocs" :key="entry._id">
    {{entry.title}}


  </li>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
