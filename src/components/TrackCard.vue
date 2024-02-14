<template>
  <div class="p-4 border-2 border-gray-500 rounded-md text-center">
    <p class="mb-1 font-medium text-lg">{{ title }}</p>
    <p class="font-bold text-2xl">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
});
</script>

<style scoped></style>
