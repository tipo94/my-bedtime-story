<template>
  <div class="screen-wrapper">
    <div class="screen-content">
      <!-- Back Button -->
     

      <!-- Main Content Container -->
      <div class="flex flex-col items-center justify-between h-full">
        <!-- Children Tree Illustration - Full Width -->
        <div class="w-full">
          <img src="@/assets/children_tree.png" 
               alt="Children reading under a tree" 
               class="w-full h-auto object-contain" />
        </div>

        <!-- Buttons Container with More Padding -->
        <div class="w-3/4 mx-auto mt-8 pb-12 space-y-5">
          <!-- Create Random Story Button -->
          <button @click="$emit('shuffle')" 
                  :disabled="isLoading"
                  class="story-button primary-button group">
            <img src="@/assets/books_icon.png" 
                 alt="Books icon"
                 class="w-6 h-6 object-contain" />
            Create Random Story
          </button>

          <!-- Generate from Settings Button -->
          <button @click="$emit('show-form')" 
                  :disabled="isLoading"
                  class="story-button secondary-button group">
            <img src="@/assets/list_icon.png" 
                 alt="List icon"
                 class="w-6 h-6 object-contain" />
            Generate from Settings
          </button>

          <!-- Generate From Prompt Button -->
         <!-- <button @click="$emit('show-prompt')" 
                  :disabled="isLoading"
                  class="story-button tertiary-button group">
            <img src="@/assets/cog_icon.png" 
                 alt="Settings icon"
                 class="w-6 h-6 object-contain" />
            Generate From Prompt
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';

defineProps<{
  isLoading: boolean
}>();

defineEmits<{
  (e: 'shuffle'): void
  (e: 'show-form'): void
  (e: 'show-prompt'): void
}>();
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-y-auto overflow-x-hidden;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative min-h-screen w-full max-w-md mx-auto;
}

.story-button {
  @apply flex items-center justify-center gap-3 px-4 py-3 rounded-full
         text-lg font-medium transition-all duration-200 w-full
         text-white border-none cursor-pointer relative
         hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-70 
         disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none;
}

.primary-button {
  background: linear-gradient(to right, #4A90E2, #5E5CE6);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.secondary-button {
  background: linear-gradient(to right, #9C27B0, #BA68C8);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

.tertiary-button {
  background: linear-gradient(to right, #E91E63, #F48FB1);
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
}

.story-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.story-button::after {
  content: '';
  @apply absolute inset-0 rounded-full opacity-30 -z-10 transition-all duration-200;
  background: inherit;
  filter: blur(10px);
}

.story-button:hover::after {
  @apply opacity-50;
  filter: blur(15px);
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 