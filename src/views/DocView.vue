<script>
import UpdateDoc from '@/components/UpdateDoc.vue';
import UpdateCode from '@/components/UpdateCode.vue';

export default {
  components: {
    UpdateDoc,
    UpdateCode
  },
  data() {
    return {
      isCode: false
    }
  },
  created() {
    const type = this.$route.params.type;

    this.isCode = type === 'code';
  }
};
</script>

<template>
  <div class="update-doc">
    <component :is="isCode ? 'UpdateCode' : 'UpdateDoc'" />
  </div>
</template>

<style>

</style>
