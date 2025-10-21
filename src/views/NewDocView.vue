<script>
import NewDoc from '@/components/NewDoc.vue';
import { inject } from 'vue';

export default {
    setup() {
      const userState = inject('userState');
      return {userState };
    },
  components: {
    NewDoc,
  }
};
</script>

<template>
  <div class="editor">
    <h1>Skapa dokument</h1>
    <NewDoc />
  </div>
</template>

<style>
.active {
  background-color: green;
  color: white;
}
</style>
