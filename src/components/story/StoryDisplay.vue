<template>
  <div class="screen-wrapper">
    <div class="screen-content">
      <!-- Navigation Bar -->
      <div class="flex items-center justify-between px-4 py-3 mb-4">
        <!-- Back Button -->
        <button @click="$emit('previous-page')" 
                :disabled="currentPage === 0"
                class="w-10 h-10 
                       flex items-center justify-center
                       transition-colors duration-200 disabled:opacity-50">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-white" />
        </button>
        
        <!-- Page Counter -->
        <span class="font-comic text-lg text-white">
          {{ currentPage + 1 }} / {{ storyPages.length }}
        </span>
        
        <!-- Next Button -->
        <button @click="$emit('next-page')" 
                :disabled="currentPage === storyPages.length - 1"
                class="w-10 h-10 rounded-full
                       flex items-center justify-center
                       transition-colors duration-200 disabled:opacity-50">
          <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-white" />
        </button>
      </div>

      <!-- Story Content -->
      <div class="px-4 ">
        <!-- Title (only on first page) -->
        <h1 v-if="currentPage === 0" 
            class="text-2xl font-comic text-white text-center mb-6 font-semibold">
          {{ storyTitle }}
        </h1>
        
        <!-- Story Image -->
        <div class="mb-6 relative">
          <div v-if="pageImages[currentPage]" 
               class="w-full rounded-3xl overflow-hidden">
            <img :src="pageImages[currentPage]" 
                 :alt="`Illustration for page ${currentPage + 1}`"
                 class="w-full h-auto"
                 @error="handleImageError" />
          </div>
          <div v-else 
               class="w-full aspect-[4/3] rounded-3xl bg-white/10 
                      flex flex-col items-center justify-center">
            <div class="relative w-16 h-16 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'spinner']" 
                               class="text-3xl text-white animate-spin" />
            </div>
            <p class="mt-4 text-white/80 font-comic text-lg">
              Generating illustration...
            </p>
          </div>

          <!-- Next Page Arrow Indicator -->
          <button v-if="currentPage < storyPages.length - 1"
                  @click="$emit('next-page')"
                  class="absolute right-4 top-1/2 -translate-y-1/2
                         w-12 h-12 rounded-full
                         flex items-center justify-center
                         transition-all duration-300 group">
            <font-awesome-icon :icon="['fas', 'chevron-right']" 
                             class="text-white text-xl group-hover:scale-110 transition-transform duration-300" />
          </button>

          <!-- Audio Control -->
          <button @click="$emit('read-page')"
                  class="absolute top-4 right-4 w-8 h-8 rounded-full p-2 
                         bg-black/30 hover:bg-black/50 backdrop-blur-sm
                         flex items-center justify-center
                         transition-all duration-300">
            <font-awesome-icon 
                :icon="['fas', isSpeaking ? 'volume-xmark' : isAudioReady ? 'volume-high' : 'cloud-arrow-down']"
                class="text-white"
                :class="{ 'text-red-500': isSpeaking }" />
          </button>
        </div>

        <!-- Story Text -->
        <div class="flex flex-col">
          <p class="text-lg text-white leading-relaxed font-comic">
            {{ storyPages[currentPage] }}
          </p>
        </div>

        <!-- Back to Main Menu Link -->
        <div class="fixed bottom-0 left-0 w-full p-4 bg-black/20 backdrop-blur-sm">
          <button @click="$emit('go-to-main')" 
                  class="text-white/80 h-8 hover:text-white flex items-center gap-2 transition-colors duration-200">
            <ion-icon :icon="chevronBackOutline" 
                     style="font-size: 28px;" />
            <span class="text-lg">Back to main menu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTTSStore } from '@/stores/ttsStore';
import { chevronBackOutline } from 'ionicons/icons';
const props = defineProps<{
  currentPage: number
  storyPages: string[]
  pageImages: Record<number, string>
  storyTitle: string
}>();

defineEmits<{
  (e: 'next-page'): void
  (e: 'previous-page'): void
  (e: 'read-page'): void
  (e: 'go-to-main'): void
}>();

const ttsStore = useTTSStore();

const isAudioReady = computed(() => {
  return !!ttsStore.audioCache[props.currentPage];
});

const isSpeaking = computed(() => ttsStore.isSpeaking);

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = ''; // Clear the source to show loading state
};
</script>

<style scoped>
.screen-wrapper {
  @apply fixed inset-0 min-h-screen w-full overflow-auto;
  background: linear-gradient(180deg, #4A90E2 0%, #9C27B0 100%);
}

.screen-content {
  @apply relative min-h-screen w-full pt-4 pb-16;
}

.font-comic {
  font-family: 'Comic Neue', cursive;
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