<script>
import NewDoc from '@/components/NewDoc.vue';
import { inject } from 'vue';

export default {
  emits: ['doc-created'],
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
    <NewDoc @doc-created="$emit('doc-created')"/>
  </div>
</template>

<style>
.active {
  background-color: green;
  color: white;
}
</style>
