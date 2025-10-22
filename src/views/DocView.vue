<script>
import UpdateDoc from '@/components/UpdateDoc.vue';
import UpdateCode from '@/components/UpdateCode.vue';
import { inject } from 'vue';

export default {
    setup() {
      const userState = inject('userState');
      return {userState };
    },
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
  },
  watch: {
    '$route.params.type': {
      immediate: true,
      handler(newType) {
        this.isCode = newType === 'code';
      }
    }
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
