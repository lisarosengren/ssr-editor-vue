<script setup>
const emit = defineEmits(['back' ]);
</script>
<template>
<h1>Åh nej!</h1>
<h2>Nånting har gått åt pipan...</h2>
<button class="button" @click="emit('back')">Tillbaka</button>


</template>

<style>

</style>
