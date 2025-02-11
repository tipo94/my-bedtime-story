<template>
  <div class="screen-wrapper">
    <div class="screen-content">
      <!-- Back Button -->
      <button @click="store.goBack" 
              class="text-white/80 hover:text-white mt-4">
        <ion-icon :icon="chevronBackOutline" 
                 style="font-size: 28px;" />
      </button>

      <!-- Main Content Container -->
      <div class="flex flex-col space-y-4 items-center h-full">
        <!-- Character Group Illustration - Full Width -->
        <div class="w-full">
          <img src="@/assets/character_group.png" 
               alt="Group of diverse children characters" 
               class="w-full h-auto object-contain" />
        </div>

        <!-- Title and Description -->
        <div class="text-center px-2 flex flex-col">
          <h1 class="text-4xl font-bold text-white mb-4">
            Choose Your Character
          </h1>
          <p class="text-2xl text-white/90">
            Select a character to begin your magical story adventure
          </p>
        </div>
        
        <!-- Character Selection Buttons -->
        <div class="mx-auto grid grid-cols-2 gap-6 px-4">
          <!-- Boy Option -->
          <button @click="selectGender('boy')" 
                  class="character-button">
            <img src="@/assets/boy_avatar.png" 
                 alt="Boy Character" 
                 class="w-28 h-28 object-contain mb-4" />
            <span class="text-3xl font-bold text-white">Boy</span>
          </button>
          
          <!-- Girl Option -->
          <button @click="selectGender('girl')" 
                  class="character-button">
            <img src="@/assets/girl_avatar.png" 
                 alt="Girl Character" 
                 class="w-28 h-28 object-contain mb-4" />
            <span class="text-3xl font-bold text-white">Girl</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoryStore } from '@/stores/storyStore';
import { IonIcon } from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';

const store = useStoryStore();

const selectGender = (gender: string) => {
  store.heroGender = gender;
  store.navigateTo('name');
};
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-y-auto overflow-x-hidden;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative min-h-screen w-full max-w-md mx-auto;
}

.character-button {
  @apply flex flex-col items-center justify-center py-4 px-8 rounded-3xl
         bg-white/10 backdrop-blur-sm border-2 border-white/20
         transition-all duration-300 hover:scale-105 hover:bg-white/20;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.character-button:hover {
  @apply border-white/40;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
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