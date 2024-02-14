<template>
  <div>
    <div class="flex gap-2">
      <button
        class="px-2 border-2 border-gray-300 text-xl rounded"
        @click="back">
        &lt
      </button>
      <button
        class="px-2 border-2 border-gray-300 text-xl rounded"
        @click="foward">
        &gt
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter()

function back() {
  router.go(-1);
}

function foward() {
  router.go(1);
}
</script>
