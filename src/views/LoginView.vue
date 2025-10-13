<script>
import UserLogin from '@/components/UserLogin.vue';

export default {
  components: {
    UserLogin,
  }
};
</script>

<template>
  <div class="editor">
    <h1>Logga in</h1>
    <UserLogin />
  </div>
</template>

<style>
.active {
  background-color: green;
  color: white;
}
</style>
