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
      <div class="flex-1 flex flex-col space-y-6 items-center  w-full">
        <div class="flex flex-col space-y-2">
        <h1 class="text-4xl font-bold text-white mb-4 text-center">
          Optional Settings
        </h1>
        <p class="text-xl text-white text-center mb-12">
          Customize your story further
        </p>
        </div>
        
        <!-- Story Theme Selection -->
        <div class="flex flex-col ">
          <h3 class="text-2xl font-medium text-white mb-6 text-center">Choose a Theme</h3>
          <div class="grid grid-cols-2 gap-4">
            <button @click="selectTheme('friendship')"
                    :class="[
                      'theme-button',
                      store.theme === 'friendship' ? 'theme-active' : 'theme-inactive'
                    ]">
              <span class="text-xl mb-2">🤝</span>
              Friendship
            </button>
            <button @click="selectTheme('courage')"
                    :class="[
                      'theme-button',
                      store.theme === 'courage' ? 'theme-active' : 'theme-inactive'
                    ]">
              <span class="text-xl mb-2">💪</span>
              Courage
            </button>
            <button @click="selectTheme('kindness')"
                    :class="[
                      'theme-button',
                      store.theme === 'kindness' ? 'theme-active' : 'theme-inactive'
                    ]">
              <span class="text-xl mb-2">💝</span>
              Kindness
            </button>
            <button @click="selectTheme('perseverance')"
                    :class="[
                      'theme-button',
                      store.theme === 'perseverance' ? 'theme-active' : 'theme-inactive'
                    ]">
              <span class="text-xl mb-2">🎯</span>
              Never Give Up
            </button>
          </div>
        </div>
        
        <!-- Additional Details -->
        <div class="w-full flex flex-col space-y-4">
          <h3 class="text-2xl font-medium text-white mt-4 text-center">Additional Details</h3>
          <p class="text-lg text-white/80 mb-4 text-center">Add any extra details about your character or story</p>
          <div class="flex px-2">
            <textarea v-model="store.additionalDetails"
                    placeholder="Type your ideas here..."
                    rows="4"
                    class="w-full px-6 py-4 text-xl rounded-3xl bg-white/10 backdrop-blur-sm
                           border-2 border-white/20 focus:border-white/40
                           text-white placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-white/20
                           resize-none"
                    style="min-height: 120px;">
          </textarea>
          </div>
          
        </div>

        <!-- Continue Button -->
        <div class="flex px-8">
        <button @click="store.goToNextStep('style')"
                class="w-full py-4 px-6 rounded-full bg-[#4263EB] hover:bg-[#3b5bdb]
                       text-white text-xl font-medium relative overflow-hidden
                       transition-all duration-300 group">
          Continue to Style
          <ion-icon :icon="arrowForward" 
                   class="absolute right-6 top-1/2 transform -translate-y-1/2
                          opacity-0 group-hover:opacity-100 group-hover:translate-x-2
                          transition-all duration-300" />
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

const selectTheme = (theme: string) => {
  store.theme = theme;
};
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-auto;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative min-h-screen w-full px-4 pt-8 pb-16;
}

.theme-button {
  @apply flex flex-col items-center justify-center py-6 px-4 rounded-3xl
         text-lg font-medium transition-all duration-200
         hover:-translate-y-0.5;
}

.theme-active {
  @apply bg-[#4263EB] text-white;
  box-shadow: 0 4px 15px rgba(66, 99, 235, 0.3);
}

.theme-inactive {
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

/* Custom textarea styles */
textarea {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
</style> 