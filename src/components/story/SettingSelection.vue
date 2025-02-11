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
      <div class="flex-1 flex flex-col items-center px-4">
        <h1 class="text-4xl font-bold text-white mb-4 text-center">
          Choose Your Setting
        </h1>
        <p class="text-xl text-white text-center mb-12">
          Where will your adventure take place?
        </p>
        
        <div class="w-full flex flex-col space-y-8">
          <div class="grid grid-cols-2 gap-6 w-full">
            <!-- Magical Forest -->
            <button @click="selectSetting('magical_forest')"
                    class="setting-card group">
              <img src="@/assets/forest.webp" alt="Magical Forest" 
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>
              <span class="absolute bottom-6 left-1 text-xl font-medium text-white">Magical Forest</span>
            </button>
            
            <!-- Space Station -->
            <button @click="selectSetting('space_station')"
                    class="setting-card group">
              <img src="@/assets/space.webp" alt="Space Station" 
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>
              <span class="absolute bottom-12 left-1 text-xl font-medium text-white">Space Station</span>
            </button>
            
            <!-- Underwater City -->
            <button @click="selectSetting('underwater_city')"
                    class="setting-card group">
              <img src="@/assets/underwater.webp" alt="Underwater City" 
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>
              <span class="absolute bottom-6 left-1 text-xl font-medium text-white">Underwater City</span>
            </button>
            
            <!-- Castle -->
            <button @click="selectSetting('castle')"
                    class="setting-card group">
              <img src="@/assets/castle.webp" alt="Castle" 
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>
              <span class="absolute bottom-12 left-10 text-xl font-medium text-white">Castle</span>
            </button>
          </div>

          <!-- Custom Setting Input -->
          <div class="w-full text-center">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-4 text-lg text-white/60 bg-transparent">or create your own</span>
              </div>
            </div>
            
            <div class="flex flex-col mt-4 space-y-4">
              <div class="flex ">
                <input type="text"
                     v-model="store.customSetting"
                     placeholder="Describe your setting..."
                     class="w-full px-6 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm
                            border-2 border-white/20 focus:border-white/40
                            text-white placeholder-white/40
                            focus:outline-none focus:ring-2 focus:ring-white/20" 
                     @keyup.enter="selectCustomSetting" />
              </div>
              <div class="flex ">
              <button @click="selectCustomSetting"
                      :disabled="!store.customSetting.trim()"
                      class=" w-full py-4 px-6 rounded-full bg-[#4263EB] hover:bg-[#3b5bdb]
                             text-white text-lg font-medium relative overflow-hidden
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
  </div>
</template>

<script setup lang="ts">
import { useStoryStore } from '@/stores/storyStore';
import { IonIcon } from '@ionic/vue';
import { chevronBackOutline, arrowForward } from 'ionicons/icons';

const store = useStoryStore();

const selectSetting = (settingKey: 'magical_forest' | 'space_station' | 'underwater_city' | 'castle') => {
  console.log('Setting selected:', settingKey);
  console.log('Current settingMap:', store.settingMap);
  console.log('Setting value to be set:', store.settingMap[settingKey]);
  
  store.setting = store.settingMap[settingKey];
  console.log('Setting after update:', store.setting);
  
  store.goToNextStep('optional');
  console.log('Navigating to optional step');
};

const selectCustomSetting = () => {
  if (store.customSetting.trim()) {
    console.log('Custom setting selected:', store.customSetting);
    store.setting = store.customSetting.trim();
    console.log('Setting after update:', store.setting);
    
    store.goToNextStep('optional');
    console.log('Navigating to optional step');
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

.setting-card {
  @apply relative aspect-square rounded-3xl overflow-hidden
         transition-all duration-300 hover:scale-[1.02];
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.setting-card::after {
  content: '';
  @apply absolute inset-0 opacity-0 transition-opacity duration-300;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.3);
  border-radius: inherit;
}

.setting-card:hover::after {
  @apply opacity-100;
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