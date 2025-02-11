<template>
  <div class="screen-wrapper">
    <div class="screen-content flex flex-col items-center justify-center min-h-screen">
      <!-- Characters Image -->
      <img src="@/assets/three_boys.png" 
           alt="Three cartoon boys" 
           class="w-[300px] h-auto mb-16" />

      <!-- Loading Spinner -->
      <div class="relative w-32 h-32">
        <div class="absolute inset-0 rounded-full border-4 border-white/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-[#4263EB] animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-white/60 text-lg">Loading...</span>
        </div>
      </div>

      <!-- Loading Text -->
      <p class="text-2xl font-medium text-white mt-8">
        Creating your story
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this component
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-hidden;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative w-full max-w-md mx-auto px-4;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 