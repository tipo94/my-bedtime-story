<template>
  <div class="screen-wrapper">
    <div class="screen-content">
      <!-- Back Button -->
      <button @click="store.goBack" 
              class="text-white/80 hover:text-white mt-4">
        <ion-icon :icon="chevronBackOutline" 
                 style="font-size: 28px;" />
      </button>

      <div class="flex flex-col items-center justify-between h-full pt-16 pb-8">
        <!-- Title and Description -->
        <div class="flex flex-col text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-4">
            Name Your Character
          </h1>
          <p class="text-2xl text-white/90">
            What's your character's name
          </p>
        </div>

        <!-- Name Input Section -->
        <div class="flex flex-col space-y-4 w-full">
          <div class="flex px-8">
          <input type="text"
                 v-model="store.heroName"
                 placeholder="Enter your character name..."
                 class="w-full px-8 py-5 text-lg rounded-full bg-white
                        text-[#030303] placeholder-gray-400
                        focus:outline-none focus:ring-4 focus:ring-white/20"
                 @keyup.enter="selectName" />
                </div>
          <!-- Continue Button -->
          <div class="flex px-8">
          <button @click="selectName"
                  :disabled="!store.heroName.trim()"
                  class="w-full px-8 py-5 rounded-full bg-[#4263EB] hover:bg-[#3b5bdb]
                         text-xl font-medium text-white
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300">
            Continue
          </button>
          </div>
        </div>

        <!-- Character Preview -->
        <div class="mt-8">
          <img :src="characterImage"
               :alt="`${store.heroGender} character`"
               class="w-[300px] h-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoryStore } from '@/stores/storyStore';
import { IonIcon } from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import boyImage from '@/assets/boy_full.png';
import girlImage from '@/assets/girl_full.png';

const store = useStoryStore();

const characterImage = computed(() => 
  store.heroGender === 'boy' ? boyImage : girlImage
);

const selectName = () => {
  if (store.heroName.trim()) {
    store.goToNextStep('setting');
  }
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

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Input focus ring animation */
input:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}
</style> 