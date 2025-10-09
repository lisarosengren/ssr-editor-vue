<script>
import NewDoc from '@/components/NewDoc.vue';

export default {
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
