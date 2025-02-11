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
          Choose Art Style
        </h1>
        <p class="text-2xl text-white text-center mb-12">
          Select the art style for your story's illustrations
        </p>
        
        <div class="grid grid-cols-2 gap-6 w-full">
          <!-- Cartoon -->
          <button @click="selectStyle('cartoon')"
                  class="style-card group">
            <div class="w-20 h-20 bg-white/20 rounded-2xl mb-2 flex items-center justify-center">
              <img src="@/assets/cartoon.webp" alt="Cartoon Style" class="w-18 h-18 object-contain" />
            </div>
            <span class="text-xl font-medium text-white">Cartoon</span>
          </button>
          
          <!-- Manga -->
          <button @click="selectStyle('manga')"
                  class="style-card group">
            <div class="w-20 h-20 bg-white/20 rounded-2xl mb-2 flex items-center justify-center">
              <img src="@/assets/manga.webp" alt="Manga Style" class="w-18 h-18 object-contain" />
            </div>
            <span class="text-xl font-medium text-white">Manga</span>
          </button>
          
          <!-- Watercolor -->
          <button @click="selectStyle('watercolor')"
                  class="style-card group">
            <div class="w-20 h-20 bg-white/20 rounded-2xl mb-2 flex items-center justify-center">
              <img src="@/assets/watercolor.webp" alt="Watercolor Style" class="w-18 h-18 object-contain" />
            </div>
            <span class="text-xl font-medium text-white">Watercolor</span>
          </button>
          
          <!-- Traditional -->
          <button @click="selectStyle('traditional')"
                  class="style-card group">
            <div class="w-20 h-20 bg-white/20 rounded-2xl mb-2 flex items-center justify-center">
              <img src="@/assets/traditional.webp" alt="Traditional Style" class="w-18 h-18 object-contain" />
            </div>
            <span class="text-xl font-medium text-white">Traditional</span>
          </button>
        </div>

        <!-- Custom Style Input -->
        <div class="w-full mt-12 text-center flex flex-col space-y-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 text-lg text-white/60 bg-transparent">or describe your own style</span>
            </div>
          </div>
          
          <div class="flex flex-col space-y-4">
            <div class="flex px-8">
            <input type="text"  
                   v-model="store.customStyle"
                   placeholder="Describe your art style..."
                   class="w-full px-4 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm
                          border-2 border-white/20 focus:border-white/40
                          text-white placeholder-white/40
                          focus:outline-none focus:ring-2 focus:ring-white/20" 
                   @keyup.enter="selectCustomStyle" />
            </div>
            <div class="flex px-2">
            <button @click="selectCustomStyle"
                    :disabled="!store.customStyle.trim()"
                    class="w-full py-4 px-6 rounded-full bg-[#4263EB] hover:bg-[#3b5bdb]
                           text-white text-xl font-medium relative overflow-hidden
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 group">
              Continue with custom
              <ion-icon :icon="arrowForward" 
                       class="absolute right-6 top-1/2 transform -translate-y-1/2
                              opacity-0 group-hover:opacity-100 group-hover:translate-x-2
                              transition-all duration-300" />
            </button>
            </div>
          </div>
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

const selectStyle = (style: 'cartoon' | 'manga' | 'watercolor' | 'traditional') => {
  console.log('Style selected:', style);
  console.log('Current artStyleMap:', store.artStyleMap);
  console.log('Style value to be set:', store.artStyleMap[style]);
  
  store.illustrationStyle = store.artStyleMap[style];
  console.log('Style after update:', store.illustrationStyle);
  
  store.goToNextStep('language');
  console.log('Navigating to language step');
};

const selectCustomStyle = () => {
  if (store.customStyle.trim()) {
    console.log('Custom style selected:', store.customStyle);
    store.illustrationStyle = store.customStyle.trim();
    console.log('Style after update:', store.illustrationStyle);
    
    store.goToNextStep('language');
    console.log('Navigating to language step');
  }
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

.style-card {
  @apply flex flex-col items-center justify-center py-4 px-2 rounded-3xl
         transition-all duration-300 hover:scale-[1.02]
         bg-white/10 backdrop-blur-sm border-2 border-white/20
         hover:bg-white/20 hover:border-white/30;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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

/* Custom input styles */
input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

input {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Autofill styles */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style> 