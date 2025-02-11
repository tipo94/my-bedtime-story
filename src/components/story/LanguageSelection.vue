<template>
  <div class="screen-wrapper">
    <div class="screen-content">
      <!-- Back Button -->
      <button @click="store.goBack" 
              class="text-white/80 hover:text-white mt-4">
        <ion-icon :icon="chevronBackOutline" 
                 style="font-size: 28px;" />
      </button>

      <!-- Content Container -->
      <div class="flex-1 flex flex-col space-y-4 items-center px-4 ">
        <h1 class="text-4xl font-bold text-white mb-4 text-center">
          Choose Your Language
        </h1>
        <p class="text-2xl text-white text-center mb-12">
          Your story will be created in English by default
        </p>
        
        <!-- Language Buttons -->
        <div class="w-full flex flex-col space-y-4 ">
          <button @click="selectLanguage('english')"
                  :class="[
                    'language-button group',
                    store.language === 'english' ? 'language-active' : 'language-inactive'
                  ]">
            English
           
          </button>
          
          <button @click="selectLanguage('spanish')"
                  :class="[
                    'language-button group',
                    store.language === 'spanish' ? 'language-active' : 'language-inactive'
                  ]">
            Spanish
          </button>
          
          <button @click="selectLanguage('french')"
                  :class="[
                    'language-button group',
                    store.language === 'french' ? 'language-active' : 'language-inactive'
                  ]">
            French
          </button>
        </div>
        
        <!-- Create Story Button -->
         <div class="flex w-full pt-8">
        <button @click="$emit('submit')"
                class="w-full py-4 px-6 rounded-full bg-[#4263EB] hover:bg-[#3b5bdb]
                       text-white text-center text-xl font-medium relative overflow-hidden
                       transition-all duration-300 group">
          Create My Story
         
        </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoryStore } from '@/stores/storyStore';
import { IonIcon } from '@ionic/vue';
import { chevronBackOutline, arrowForward } from 'ionicons/icons';

const store = useStoryStore();

defineEmits<{
  (e: 'submit'): void
}>();

const selectLanguage = (language: string) => {
  store.language = language;
};
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-y-auto overflow-x-hidden;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative min-h-screen w-full max-w-md mx-auto px-4 pt-8 pb-16;
}

.language-button {
  @apply w-full py-4 px-6 rounded-full text-lg font-medium relative
         transition-all duration-300 hover:-translate-y-0.5;
}

.language-active {
  @apply bg-[#4263EB] text-white;
  box-shadow: 0 4px 15px rgba(66, 99, 235, 0.3);
}

.language-inactive {
  @apply bg-white/10 text-white/80 backdrop-blur-sm border-2 border-white/20
         hover:bg-white/20 hover:border-white/30;
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