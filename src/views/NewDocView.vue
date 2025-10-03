<script>
import NewDoc from '@/components/NewDoc.vue';
import NewCode from '@/components/NewCode.vue';

export default {
  components: {
    NewDoc,
    NewCode
  },
  data() {
    return {
      isCode: false
    }
  }
};
</script>

<template>
  <div class="editor">
    <h1>Skapa dokument</h1>
    <div class="toggle">
      <button @click="isCode = false" :class="{ active: !isCode }">Text</button>
      <button @click="isCode = true" :class="{ active: isCode }">Code</button>
    </div>

    <component :is="isCode ? 'NewCode' : 'NewDoc'" />

  </div>
</template>

<style>
.active {
  background-color: green;
  color: white;
}
</style>
