<script>
import NewUser from '@/components/NewUser.vue';

export default {
  components: {
    NewUser,
  }
};
</script>

<template>
  <div class="user-form">
    <h1>Registrera användare</h1>
    <NewUser />
  </div>
</template>

<style>
.active {
  background-color: green;
  color: white;
}
</style>
