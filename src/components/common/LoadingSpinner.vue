<template>
  <div class="fixed inset-0 bg-white/90 dark:bg-gray-900/90 
              flex flex-col items-center justify-center z-50">
    <div class="relative w-24 h-24 flex items-center justify-center">
      <font-awesome-icon :icon="['fas', 'spinner']" 
                       class="text-4xl text-[#eeb163] animate-spin" />
    </div>
    <p class="mt-4 font-comic text-lg text-[#eeb163]">
      Creating your story...
    </p>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<style scoped>
.font-comic {
  font-family: 'Comic Neue', cursive;
}
</style> 