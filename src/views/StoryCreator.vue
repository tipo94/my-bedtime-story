<template>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
  <ion-page>
    <ion-content class="ion-padding bg-cream dark:bg-gray-900">
      <div class="container mx-auto max-w-md px-4 py-8">
        <!-- Title -->
        <h1 class="text-3xl font-stack text-primary dark:text-teal-400 mb-12 flex items-center gap-2">
          <span class="text-[#eeb163]"><font-awesome-icon :icon="['fas', 'book']"  /></span>
          <span class="text-black font-semibold">My Bedtime Story</span>
        </h1>

        <!-- Main buttons - Only show when form is not visible AND story is not submitted -->
        <div v-if="!showForm && !submitted" class="flex flex-col gap-4">
          <!-- Random Story Button -->
          <ion-button expand="block" 
                     @click="shuffleStory" 
                     :disabled="isLoading"
                     class="h-14 font-stack text-lg"
                     style="--background: #eeb163; --border-radius: 6px;">
            Generate Random Story
          </ion-button>

          <!-- Settings Button -->
          <ion-button expand="block" 
                     @click="showForm = !showForm" 
                     :disabled="isLoading"
                     class="h-14 font-stack text-lg"
                     style="--background: #f3f3f3; --border-radius: 6px; --color: #000000;">
            Generate from Settings
          </ion-button>

          <!-- Prompt Button -->
          <ion-button expand="block" 
                     @click="showPromptModal = true" 
                     :disabled="isLoading"
                     class="h-14 font-stack text-lg"
                     style="--background: #eeb163; --border-radius: 6px;">
            Generate from Prompt
          </ion-button>
        </div>

        <!-- Form with modern styling -->
        <div v-if="showForm" class="mx-auto max-w-md">
          <!-- Back Button -->
          <button @click="goBack" 
                  class="mb-8 flex items-center gap-1 text-[#030303] hover:text-gray-600 transition-colors duration-200">
            <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm" />
            <span class="text-xs">Back</span>
          </button>
          
          <!-- Character Selection Screen -->
          <div v-if="currentStep === 'gender'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Choose Your Character</h2>
            <p class="text-[#030303] text-center mb-8">Select a character to begin your magical story adventure.</p>
            
            <div class="grid grid-cols-2 gap-4 w-full">
              <!-- Boy Option -->
              <button @click="selectGender('boy')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754] 
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/boy.webp" alt="Boy Character" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Boy</span>
              </button>
              
              <!-- Girl Option -->
              <button @click="selectGender('girl')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/girl.webp" alt="Girl Character" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Girl</span>
              </button>
            </div>
          </div>

          <!-- Name Selection Screen -->
          <div v-if="currentStep === 'name'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Name Your Character</h2>
            <p class="text-[#030303] text-center mb-8">What's your character's name?</p>
            
            <div class="w-full flex flex-col">
              <input type="text"
                     v-model="heroName"
                     placeholder="Enter name"
                     class="max-w-full flex px-4 py-3 text-lg rounded-lg border-2 border-gray-300
                               focus:outline-none focus:border-[#eeb163] text-[#030303]
                               shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                     @keyup.enter="selectName" />
                    
              <button @click="selectName"
                      :disabled="!heroName.trim()"
                      class="max-w-full flex mt-4 py-3 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             text-white text-lg font-medium disabled:opacity-50
                             px-4
                             disabled:cursor-not-allowed">
                Continue
              </button>
            </div>
          </div>

          <!-- Setting Selection Screen -->
          <div v-if="currentStep === 'setting'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Choose Your Setting</h2>
            <p class="text-[#030303] text-center mb-8">Where will your adventure take place?</p>
            
            <div class="grid grid-cols-2 gap-4 w-full">
              <!-- Magical Forest -->
              <button @click="selectSetting('magical_forest')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754] 
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/forest.webp" alt="Magical Forest" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Magical Forest</span>
              </button>
              
              <!-- Space Station -->
              <button @click="selectSetting('space_station')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/space.webp" alt="Space Station" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Space Station</span>
              </button>
              
              <!-- Underwater City -->
              <button @click="selectSetting('underwater_city')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/underwater.webp" alt="Underwater City" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Underwater City</span>
              </button>
              
              <!-- Castle -->
              <button @click="selectSetting('castle')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/castle.webp" alt="Castle" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Castle</span>
              </button>
            </div>

            <!-- Custom Setting Input -->
            <div class="w-full mt-8 text-center">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-2 text-sm text-gray-500 bg-white">or create your own</span>
                </div>
              </div>
              
              <div class="mt-4">
                <input type="text"
                        v-model="customSetting"
                        placeholder="Describe your setting..."
                        class="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 
                               focus:outline-none focus:border-[#eeb163] text-[#030303]"
                        @keyup.enter="selectCustomSetting" />
                         
                <button @click="selectCustomSetting"
                        :disabled="!customSetting.trim()"
                        class="w-full mt-4 py-3 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                               text-white text-lg font-medium disabled:opacity-50
                               disabled:cursor-not-allowed">
                  Continue with Custom Setting
                </button>
              </div>
            </div>
          </div>

          <!-- Optional Fields Screen -->
          <div v-if="currentStep === 'optional'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Optional Settings</h2>
            <p class="text-[#030303] text-center mb-8">Customize your story further (optional)</p>
            
            <!-- Story Theme Selection -->
            <div class="w-full mb-8">
              <h3 class="text-lg font-medium text-[#030303] mb-4">Choose a Theme</h3>
              <div class="grid grid-cols-2 gap-4">
                <button @click="selectTheme('friendship')"
                        :class="[
                          'py-3 px-4 rounded-lg text-white text-center',
                          theme === 'friendship' ? 'bg-[#eeb163]' : 'bg-gray-200 text-gray-700'
                        ]">
                  Friendship
                </button>
                <button @click="selectTheme('courage')"
                        :class="[
                          'py-3 px-4 rounded-lg text-white text-center',
                          theme === 'courage' ? 'bg-[#eeb163]' : 'bg-gray-200 text-gray-700'
                        ]">
                  Courage
                </button>
                <button @click="selectTheme('kindness')"
                        :class="[
                          'py-3 px-4 rounded-lg text-white text-center',
                          theme === 'kindness' ? 'bg-[#eeb163]' : 'bg-gray-200 text-gray-700'
                        ]">
                  Kindness
                </button>
                <button @click="selectTheme('perseverance')"
                        :class="[
                          'py-3 px-4 rounded-lg text-white text-center',
                          theme === 'perseverance' ? 'bg-[#eeb163]' : 'bg-gray-200 text-gray-700'
                        ]">
                  Never Give Up
                </button>
              </div>
            </div>
            
            <!-- Additional Details -->
            <div class="w-full mb-8 flex flex-col">
              <h3 class="text-lg font-medium text-[#030303] mb-4">Additional Details</h3>
              <p class="text-sm text-gray-600 mb-2">Type any extra details about your character or story</p>
              <textarea v-model="additionalDetails"
                        placeholder="Add any other details about your character or story..."
                        rows="4"
                        class="max-w-full flex px-4 py-3 text-lg rounded-lg border-2 border-gray-300 
                               focus:outline-none focus:border-[#eeb163] text-[#030303]
                               resize-none"
                        style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
              </textarea>
            </div>
            
            <!-- Continue Button in Optional Fields Screen -->
            <div class="w-full px-4 flex">
              <button 
                      class="w-full p-3 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             text-white text-lg font-medium text-center"
                      @click="currentStep = 'style'">
                Next
              </button>
            </div>
          </div>

          <!-- Illustration Style Selection Screen -->
          <div v-if="currentStep === 'style'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Choose Illustration Style</h2>
            <p class="text-[#030303] text-center mb-8">Select the art style for your story's illustrations</p>
            
            <div class="grid grid-cols-2 gap-4 w-full">
              <!-- Cartoon -->
              <button @click="selectStyle('cartoon')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754] 
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/cartoon.webp" alt="Cartoon Style" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Cartoon</span>
              </button>
              
              <!-- Manga -->
              <button @click="selectStyle('manga')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754] 
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/manga.webp" alt="Manga Style" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Manga</span>
              </button>
              
              <!-- Watercolor -->
              <button @click="selectStyle('watercolor')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/watercolor.webp" alt="Watercolor Style" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Watercolor</span>
              </button>
              
              <!-- Traditional -->
              <button @click="selectStyle('traditional')"
                      class="aspect-square rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             flex flex-col items-center justify-center p-4 text-white">
                <div class="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                  <img src="@/assets/traditional.webp" alt="Traditional Style" class="w-12 h-12 object-contain" />
                </div>
                <span class="text-lg font-medium text-center">Traditional</span>
              </button>
            </div>

            <!-- Custom Style Input -->
            <div class="w-full mt-8 text-center">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-2 text-sm text-gray-500 bg-white">or describe your own style</span>
                </div>
              </div>
              
              <div class="mt-4">
                <input type="text"
                        v-model="customStyle"
                        placeholder="Describe your art style..."
                        class="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 
                               focus:outline-none focus:border-[#eeb163] text-[#030303]"
                        @keyup.enter="selectCustomStyle" />
                         
                <button @click="selectCustomStyle"
                        :disabled="!customStyle.trim()"
                        class="w-full mt-4 py-3 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                               text-white text-lg font-medium disabled:opacity-50
                               disabled:cursor-not-allowed">
                  Continue with Custom Style
                </button>
              </div>
            </div>
          </div>

          <!-- Language Selection Screen -->
          <div v-if="currentStep === 'language'" class="flex flex-col items-center px-4">
            <h2 class="text-2xl font-medium text-[#030303] mb-2">Choose Your Language</h2>
            <p class="text-[#030303] text-center mb-8">Your story will be created in English by default</p>
            
            <div class="flex gap-4 justify-center w-full mb-8">
              <button @click="selectLanguage('french')"
                      :class="[
                        'py-2 px-4 rounded-lg text-lg font-medium',
                        language === 'french' 
                          ? 'bg-[#eeb163] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      ]">
                French
              </button>
              
              <button @click="selectLanguage('english')"
                      :class="[
                        'py-2 px-4 rounded-lg text-lg font-medium',
                        language === 'english' 
                          ? 'bg-[#eeb163] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      ]">
                English
              </button>
              
              <button @click="selectLanguage('spanish')"
                      :class="[
                        'py-2 px-4 rounded-lg text-lg font-medium',
                        language === 'spanish' 
                          ? 'bg-[#eeb163] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      ]">
                Spanish
              </button>
            </div>
            
            <!-- Create Story Button -->
            <div class="w-full px-4">
              <button @click="handleSubmit"
                      class="w-full p-3 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                             text-white text-lg font-medium">
                Create My Story
              </button>
            </div>
          </div>
        </div>

        <!-- Story display with book-like styling -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" 
             class="story-con max-w-full flex flex-col bg-white dark:bg-gray-800 px-8
                    rounded-3xl shadow-2xl overflow-hidden transition-all duration-300
                    border-4 border-primary dark:border-teal-400 pb-8">
          <!-- Story navigation with Font Awesome icons -->
          <div class="flex items-center justify-between px-6 py-4">
            <!-- Previous page button -->
            <button @click="previousPage" 
                    :disabled="currentPage === 0"
                    class="w-8 h-8 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                           flex items-center justify-center p-2
                           transition-colors duration-200 disabled:opacity-50">
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm text-white" />
            </button>
            
            <!-- Page counter -->
            <span class="font-stack text-base text-[#030303] min-w-[80px] text-center">
              {{ currentPage + 1 }} / {{ storyPages.length }}
            </span>
            
            <!-- Next page button -->
            <button @click="nextPage" 
                    :disabled="currentPage === storyPages.length - 1"
                    class="w-8 h-8 rounded-lg bg-[#eeb163] hover:bg-[#e5a754]
                           flex items-center justify-center p-2
                           transition-colors duration-200 disabled:opacity-50">
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-sm text-white" />
            </button>
          </div>

          <!-- Story content with decorative borders -->
          <div class="flex flex-col">
            <!-- Title styling -->
            <h2 v-if="currentPage === 0" 
                class="text-3xl font-stack text-[#eeb163] text-center mb-12">
              <span class="mx-auto block px-8 py-2 border-4 border-primary dark:border-teal-400 
                           rounded-lg bg-white dark:bg-gray-800">
                {{ storyTitle }}
              </span>
            </h2>
            
            <!-- Story layout grid -->
            <div class="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
              <!-- Image section -->
              <div class="story-image-container">
                <div v-if="pageImages[currentPage]" 
                     class="rounded-3xl overflow-hidden flex border-4 border-primary dark:border-teal-400
                            bg-white shadow-xl">
                  <img :src="pageImages[currentPage]" 
                       :alt="`Illustration for page ${currentPage + 1}`"
                       class="w-full h-auto "
                       @error="pageImages[currentPage] = null">
                </div>
                <div v-else 
                     class="flex flex-col items-center justify-center h-80 bg-cream dark:bg-gray-700 
                            rounded-3xl p-6 border-4 border-primary dark:border-teal-400">
                  <div class="relative w-16 h-16 flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'spinner']" 
                                     class="text-3xl text-[#eeb163] animate-spin" />
                  </div>
                  <p class="mt-4 text-gray-600 dark:text-gray-300 font-comic text-lg">
                    Generating illustration...
                  </p>
                </div>
              </div>

              <!-- Text section -->
              <div class="story-text-container order-1 lg:order-2 flex flex-col bg-cream rounded-3xl p-8 text-justify shadow-xl">
                <div class="relative">
                
                  
                  <!-- Story text -->
                  <div class="p-4  
                              border-4 border-primary ">
                    <p class="text-xl text-gray-800 dark:text-gray-200">
                      {{ storyPages[currentPage] }}
                    </p>
                  </div>
                  
                
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating audio control -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" 
             class="fixed top-6 right-6 z-50 md:top-8 md:right-8 z-10">
          <ion-button @click="readPage"
                    class="w-14 h-14 block rounded-full text-base shadow-lg hover:shadow-xl
                           transition-all duration-300"
                    style="--background: #e9ebef; --color: #030303;
                           --background-hover: #d1d5db;
                           --border-radius: 9999px;
                           --ripple-color: transparent;
                           --background-activated: #e9ebef;
                           --background-focused: #e9ebef;
                           --background-activated-opacity: 1;
                           --background-focused-opacity: 1;
                           --padding-top: 16px;
                           --padding-bottom: 16px;
                           --padding-start: 16px;
                           --padding-end: 16px;
                           --size: 14px;"
                    :disabled="!isAudioReady || isCurrentPageLoading">
            <font-awesome-icon 
                :icon="['fas', isSpeaking ? 'volume-xmark' : isAudioReady ? 'volume-high' : 'cloud-arrow-down']"
                :style="{ 
                  color: isSpeaking ? '#ef4444' : '#030303',
                }" />
          </ion-button>
        </div>

        <!-- Loading spinner with Font Awesome -->
        <div v-if="isLoading" 
             class="fixed inset-0 bg-white/90 dark:bg-gray-900/90 
                    flex flex-col items-center justify-center z-50">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'spinner']" 
                             class="text-4xl text-[#eeb163] animate-spin" />
          </div>
          <p class="mt-4 font-comic text-lg text-[#eeb163]">
            Creating your story...
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { 
  IonPage, 
  IonContent, 
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faShuffle,
  faCog, 
  faChevronLeft, 
  faChevronRight, 
  faSpinner,
  faVolumeHigh,
  faVolumeXmark,
  faCloudArrowDown,
  faArrowLeft,
  faArrowRight,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { useTTSStore } from '@/stores/ttsStore';
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

// Add ALL Font Awesome icons to library
library.add(
  faShuffle,
  faCog, 
  faChevronLeft, 
  faChevronRight, 
  faSpinner,
  faVolumeHigh,
  faVolumeXmark,
  faCloudArrowDown,
  faArrowLeft,
  faArrowRight,
  faBook,
);

export default {
  components: { 
    IonPage, 
    IonContent, 
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonIcon,
    FontAwesomeIcon,
    ChevronDownIcon
  },
  setup() {
    const router = useRouter();
    const ttsStore = useTTSStore();
    // Pre-filled test data
    const heroName = ref('Luna');
    const heroGender = ref('girl');
    const setting = ref('magical forest');
    const specialQuality = ref('can talk to animals');
    const theme = ref('friendship');
    const language = ref('english'); // Default to English
    const additionalDetails = ref('She has a magical pendant that glows when animals are nearby. She loves helping lost creatures find their way home.');
    const submitted = ref(false);
    const story = ref('');
    const characters = ref([]);
    const isLoading = ref(false);
    const currentPage = ref(0);
    const storyPages = ref([]);
    const pageImages = ref({});
    const storyTitle = ref('');
    const isGeneratingImage = ref(false);
    const illustrationStyle = ref('whimsical'); // Default style
    const shouldContinueReading = ref(false);
    const showForm = ref(false);
    const showPromptModal = ref(false);
    const currentStep = ref('gender');
    const customStyle = ref('');
    
    const API_KEY = import.meta.env.VITE_DREAMWEAVER_API_KEY;
    if (!API_KEY) {
      console.error('Missing DREAMWEAVER API key in environment variables');
    }

    const getVoiceId = (lang: string) => {
      const voices = {
        english: {
          child: '21m00Tcm4TlvDq8ikWAM', // Rachel - young voice
          fallback: '21m00Tcm4TlvDq8ikWAM'
        },
        french: {
          child: 'ErXwobaYiN019PkySvjV', // Antoni - young voice
          fallback: 'ErXwobaYiN019PkySvjV'
        },
        spanish: {
          child: 'EXAVITQu4vr4xnSDxMaL', // Elli - young voice
          fallback: 'EXAVITQu4vr4xnSDxMaL'
        }
      };
      
      const langVoices = voices[lang] || voices.english;
      return langVoices.child;
    };

    const splitStoryIntoPages = (fullStory) => {
      // Extract title if it exists (assuming it's the first line)
      const lines = fullStory.split('\n');
      storyTitle.value = lines[0].replace(/^#\s*/, ''); // Remove markdown heading
      
      // Remove title and empty lines, clean up markdown and page numbers
      const content = lines.slice(1).join('\n')
        // Remove markdown formatting
        .replace(/#{1,6}\s+/g, '')      // Remove headers
        .replace(/\*\*/g, '')           // Remove bold
        .replace(/\*/g, '')             // Remove italic
        .replace(/`/g, '')              // Remove code blocks
        .replace(/>/g, '')              // Remove blockquotes
        // Remove section markers and titles
        .replace(/^-{3,}$/gm, '')      // Remove horizontal rules (---)
        .replace(/^Introduction$/gmi, '')
        .replace(/^Apparition du [Dd]éfi$/gm, '')
        .replace(/^Page \d+:?\s*/gi, '') // Remove page numbers and labels
        .replace(/\[Page \d+\]:?\s*/gi, '')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')     // Replace multiple newlines with double newlines
        .trim();
      
      const paragraphs = content.split('\n\n')
        .filter(p => p.trim())          // Remove empty paragraphs
        .map(p => p.trim());           // Trim each paragraph
      
      // Always create exactly 5 pages
      const pages = [];
      const totalParagraphs = paragraphs.length;
      const paragraphsPerPage = Math.ceil(totalParagraphs / 5);
      
      for (let i = 0; i < 5; i++) {
        const start = i * paragraphsPerPage;
        const end = start + paragraphsPerPage;
        const pageContent = paragraphs.slice(start, end)
          .join('\n\n')
          .trim();
        pages.push(pageContent || 'Page under construction...'); // Fallback if not enough content
      }
      
      return pages;
    };

    const getDetailedCharacterDescription = async () => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: `Create a detailed physical description for a character named ${heroName.value} who ${specialQuality.value}. Return as JSON with these fields:
                {
                  "height_build": "description of height and build",
                  "facial_features_skin_tone": "description of face and skin",
                  "hair": "hair description",
                  "eyes": "eyes description",
                  "clothing_accessories": "clothing and accessories description",
                  "distinguishing_features": "any unique features"
                }
                Make it child-friendly and match the character's gender (${heroGender.value}) and setting (${setting.value}).`
            }],
            temperature: 0.7,
            max_tokens: 500,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get character description');
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error('Error getting character description:', error);
        // Return default description if there's an error
        return {
          height_build: "average height and build",
          facial_features_skin_tone: "warm and friendly expression",
          hair: "neatly styled hair",
          eyes: "bright, expressive eyes",
          clothing_accessories: "comfortable, age-appropriate clothing",
          distinguishing_features: ""
        };
      }
    };

    // Update the retry delay to be longer
    const retryOperation = async (operation: () => Promise<any>, maxRetries = 3, delay = 5000) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error: any) {
          console.error(`Attempt ${attempt} failed:`, error);
          
          // If it's a server error and we haven't reached max retries, wait and try again
          if (error?.error?.type === 'server_error' && attempt < maxRetries) {
            const waitTime = delay * attempt; // Increase delay with each retry
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // If it's the last attempt or not a server error, throw the error
          throw error;
        }
      }
    };

    // Add sequential processing for audio pre-buffering
    const preBufferAllPages = async () => {
      try {
        console.log('Starting audio pre-buffering for all pages...');
        // Process pages sequentially instead of in parallel
        for (let i = 0; i < storyPages.value.length; i++) {
          try {
            await ttsStore.preloadAudio(i, storyPages.value[i], language.value);
            // Add delay between requests to avoid rate limiting
            if (i < storyPages.value.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(`Failed to pre-buffer audio for page ${i}:`, error);
            // Continue with next page even if one fails
          }
        }
        console.log('Audio pre-buffering complete');
      } catch (error) {
        console.error('Error during audio pre-buffering:', error);
      }
    };

    // Update generateAllImages to properly handle characters
    const generateAllImages = async () => {
      // Get detailed character description first
      const characterDescription = await getDetailedCharacterDescription();
      
      // Store original page number to restore it later
      const originalPage = currentPage.value;
      
      // Define art style mapping
      const artStyleMap = {
        cartoon: "cartoon style",
        manga: "anime manga",
        watercolor: "watercolor",
        traditional: "traditional illustration",
        custom: (style: string) => style // Handle custom style directly
      };
      
      // Process each page sequentially
      for (let pageIndex = 0; pageIndex < storyPages.value.length; pageIndex++) {
        try {
          // Generate image for this page
          const response = await fetch('https://airticle-flow.com/api/dreamweaver/illustration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
              'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              page_number: pageIndex,
              story: {
                title: storyTitle.value,
                pages: storyPages.value
              },
              characters: {
                characters: [{
                  name: heroName.value,
                  gender: heroGender.value,
                  ability: specialQuality.value,
                  setting: setting.value,
                  details: additionalDetails.value,
                  physical_description: {
                    height_build: characterDescription.height_build || "average height and build",
                    facial_features_skin_tone: characterDescription.facial_features_skin_tone || "warm and friendly expression",
                    hair: characterDescription.hair || "neatly styled hair",
                    eyes: characterDescription.eyes || "bright, expressive eyes",
                    clothing_accessories: characterDescription.clothing_accessories || "comfortable, age-appropriate clothing",
                    distinguishing_features: characterDescription.distinguishing_features || ""
                  }
                }]
              },
              art_style: illustrationStyle.value in artStyleMap 
                ? artStyleMap[illustrationStyle.value] 
                : illustrationStyle.value
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to generate illustration: ${errorData.message || response.statusText}`);
          }

          const data = await response.json();
          pageImages.value[pageIndex] = data.image_url;

          // Add delay between pages
          if (pageIndex < storyPages.value.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate image for page ${pageIndex + 1}:`, error);
          pageImages.value[pageIndex] = null;
        }
      }
    };

    // Update handleSubmit to include pre-buffering
    const handleSubmit = async () => {
      try {
        console.log('Starting story creation process...');
        isLoading.value = true;
        submitted.value = true;
        showForm.value = false; // Hide the form after submission
        
        const langPrompt = getStoryPrompt(language.value);
        console.log('Language prompt generated:', {
          language: language.value,
          promptTitle: langPrompt.title
        });

        // Use the new Dreamweaver API
        const response = await fetch('https://airticle-flow.com/api/dreamweaver/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            title: langPrompt.title,
            character: {
              name: heroName.value,
              gender: heroGender.value,
              ability: specialQuality.value,
              setting: setting.value,
              details: additionalDetails.value
            },
            theme: theme.value,
            format: langPrompt.format,
            language: language.value
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Story generation failed: ${errorData.message || response.statusText}`);
        }

        const storyData = await response.json();
        
        // Set the story title and pages from the API response
        storyTitle.value = storyData.title;
        storyPages.value = storyData.pages;
        
        // Update character refs from the response
        if (storyData.character) {
          heroName.value = storyData.character.name || heroName.value;
          heroGender.value = storyData.character.gender || heroGender.value;
          setting.value = storyData.character.setting || setting.value;
          specialQuality.value = storyData.character.ability || specialQuality.value;
          additionalDetails.value = storyData.character.details || additionalDetails.value;
        }
        
        if (storyData.theme) {
          theme.value = storyData.theme;
        }

        currentPage.value = 0;
        pageImages.value = {};
        
        // Remove main loading spinner
        isLoading.value = false;
        
        // Start pre-buffering audio and generating images in parallel
        Promise.all([
          preBufferAllPages(),
          generateAllImages()
        ]).catch(error => {
          console.error('Error in background tasks:', error);
        });

      } catch (error) {
        console.error('Story creation error:', error);
        isLoading.value = false;
        alert(`Failed to create story: ${error.message}`);
      }
    };

    // Update the nextPage function
    const nextPage = async () => {
      // Use shouldContinueReading instead of checking isSpeaking
      const wasReading = shouldContinueReading.value || ttsStore.isSpeaking;
      console.log('nextPage - Was reading:', wasReading);
      console.log('nextPage - Current page before:', currentPage.value);
      
      // Don't stop speaking if we're continuing to the next page
      if (!wasReading) {
        ttsStore.stopSpeaking();
      }

      if (currentPage.value < storyPages.value.length - 1) {
        currentPage.value++;
        console.log('nextPage - Current page after:', currentPage.value);
        console.log('nextPage - Page content:', storyPages.value[currentPage.value]?.substring(0, 50) + '...');
        
        if (Capacitor.isNativePlatform()) {
          console.log({
            message: `Page ${currentPage.value}`,
            level: 'info'
          });
        }
        
        // If we were reading, continue reading on the new page
        if (wasReading) {
          console.log('nextPage - Scheduling reading to continue');
          // Small delay to ensure page content is updated
          setTimeout(async () => {
            console.log('nextPage - Attempting to resume reading');
            try {
              await readPage();
            } catch (error) {
              console.error('Failed to resume reading:', error);
              shouldContinueReading.value = false;
              ttsStore.isSpeaking = false;
            }
          }, 100);
        }
      } else {
        console.log('nextPage - Reached last page');
        shouldContinueReading.value = false;
      }
    };

    // Update the previousPage function
    const previousPage = () => {
      const wasReading = ttsStore.isSpeaking;
      ttsStore.stopSpeaking();
      if (currentPage.value > 0) {
        currentPage.value--;
        // If we were reading, continue reading on the new page
        if (wasReading) {
          setTimeout(() => readPage(), 100);
        }
      }
    };

    // Update the readPage function
    const readPage = async () => {
      if (ttsStore.isSpeaking) {
        shouldContinueReading.value = false;
        ttsStore.stopSpeaking();
        return;
      }

      try {
        shouldContinueReading.value = true;
        // Check if audio is pre-buffered
        if (!ttsStore.audioCache[currentPage.value]) {
          // If not buffered (fallback), try to load it
          await ttsStore.preloadAudio(
            currentPage.value,
            storyPages.value[currentPage.value],
            language.value
          );
        }
        
        await ttsStore.playAudio(
          currentPage.value,
          storyPages.value[currentPage.value],
          language.value,
          // Add callback for auto-progression
          () => {
            if (shouldContinueReading.value && currentPage.value < storyPages.value.length - 1) {
              nextPage();
            } else {
              shouldContinueReading.value = false;
            }
          }
        );
      } catch (error) {
        console.error('Failed to read page:', error);
        shouldContinueReading.value = false;
        alert('Failed to generate speech. Please try again.');
      }
    };

    // Clean up on unmount
    onUnmounted(() => {
      ttsStore.stopSpeaking();
    });

    // Update computed properties
    const isAudioReady = computed(() => {
      return !!ttsStore.audioCache[currentPage.value];
    });

    const isCurrentPageLoading = computed(() => {
      return ttsStore.isPreloading[currentPage.value] || false;
    });

    const isSpeaking = computed(() => ttsStore.isSpeaking);

    // Update the shuffleStory function
    const shuffleStory = async () => {
      try {
        console.log('Starting random story settings generation...');
        isLoading.value = true;

        // Call the random_story endpoint
        const response = await fetch('https://airticle-flow.com/api/dreamweaver/random_story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

       

        // The response will already contain the generated story since the backend
        // calls summary() with the random parameters
        const storyData = await response.json();
        
        // Update the story data
        if (storyData.character) {
          heroName.value = storyData.character.name || heroName.value;
          heroGender.value = storyData.character.gender || heroGender.value;
          setting.value = storyData.character.setting || setting.value;
          specialQuality.value = storyData.character.ability || specialQuality.value;
          additionalDetails.value = storyData.character.details || additionalDetails.value;
        }
        if (storyData.theme) {
          theme.value = storyData.theme;
        }
        
        

        // Remove main loading spinner
        isLoading.value = false;
        
        // Start generating images in the background
        handleSubmit()

      } catch (error) {
        console.error('Random story generation error:', error);
        alert('Failed to generate random story. Please try again.');
        isLoading.value = false;
      }
    };

    // Add a function to get language-specific prompts
    const getStoryPrompt = (lang: string) => {
      const prompts = {
        french: {
          title: "Créez une histoire pour enfants en français avec les spécifications suivantes:",
          character: {
            name: `Nom: ${heroName.value}`,
            gender: `Genre: ${heroGender.value}`,
            ability: `Capacité spéciale: ${specialQuality.value}`,
            setting: `Lieu: ${setting.value}`,
            details: `Détails: ${additionalDetails.value}`
          },
          theme: `Thème: ${theme.value}`,
          format: "L'histoire doit être écrite en français simple et clair, adaptée aux enfants de 5-8 ans."
        },
        english: {
          title: "Create a children's story in English with the following specifications:",
          character: {
            name: `Name: ${heroName.value}`,
            gender: `Gender: ${heroGender.value}`,
            ability: `Special ability: ${specialQuality.value}`,
            setting: `Setting: ${setting.value}`,
            details: `Details: ${additionalDetails.value}`
          },
          theme: `Theme: ${theme.value}`,
          format: "The story should be written in simple, clear English suitable for children aged 5-8."
        },
        spanish: {
          title: "Crea un cuento infantil en español con las siguientes especificaciones:",
          character: {
            name: `Nombre: ${heroName.value}`,
            gender: `Género: ${heroGender.value}`,
            ability: `Habilidad especial: ${specialQuality.value}`,
            setting: `Escenario: ${setting.value}`,
            details: `Detalles: ${additionalDetails.value}`
          },
          theme: `Tema: ${theme.value}`,
          format: "La historia debe estar escrita en español simple y claro, adecuado para niños de 5-8 años."
        }
      };

      return prompts[lang] || prompts.english;
    };

    const selectGender = (gender: string) => {
      heroGender.value = gender;
      currentStep.value = 'name';
    };

    const selectName = () => {
      if (heroName.value.trim()) {
        currentStep.value = 'setting';
      }
    };

    const settingMap = {
      magical_forest: 'magical forest',
      space_station: 'space station',
      underwater_city: 'underwater city',
      castle: 'medieval castle'
    };

    const customSetting = ref('');

    const selectSetting = (settingKey: string) => {
      setting.value = settingMap[settingKey];
      currentStep.value = 'optional';
    };

    const selectCustomSetting = () => {
      if (customSetting.value.trim()) {
        setting.value = customSetting.value.trim();
        currentStep.value = 'optional';
      }
    };

    const selectTheme = (selectedTheme: string) => {
      theme.value = selectedTheme;
    };

    const startStoryCreation = () => {
      currentStep.value = 'language';
      language.value = 'english';
    };

    const selectLanguage = (selectedLanguage: string) => {
      language.value = selectedLanguage;
    };

    // Add step navigation mapping
    const stepOrder = ['gender', 'name', 'setting', 'optional', 'style', 'language'];

    const goBack = () => {
      const currentIndex = stepOrder.indexOf(currentStep.value);
      if (currentIndex <= 0) {
        // If we're at the first step, go back to main menu
        showForm.value = false;
        currentStep.value = 'gender'; // Reset to first step
      } else {
        // Otherwise go to previous step
        currentStep.value = stepOrder[currentIndex - 1];
      }
    };

    const selectStyle = (style: string) => {
      illustrationStyle.value = style;
      currentStep.value = 'language';
    };

    const selectCustomStyle = () => {
      if (customStyle.value.trim()) {
        illustrationStyle.value = customStyle.value.trim();
        currentStep.value = 'language';
      }
    };

    return { 
      heroName,
      heroGender,
      setting,
      specialQuality,
      theme,
      language,
      additionalDetails,
      illustrationStyle,
      submitted,
      handleSubmit,
      story,
      isLoading,
      currentPage,
      storyPages,
      pageImages,
      storyTitle,
      isGeneratingImage,
      nextPage,
      previousPage,
      readPage,
      showForm,
      shuffleStory,
      isAudioReady,
      isCurrentPageLoading,
      isSpeaking,
      preBufferAllPages,
      showPromptModal,
      currentStep,
      selectGender,
      selectName,
      selectSetting,
      customSetting,
      selectCustomSetting,
      selectTheme,
      startStoryCreation,
      selectLanguage,
      goBack,
      selectStyle,
      customStyle,
    };
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
}

/* Update general ion-button styles */
ion-button {
  margin: 0;
  --ripple-color: transparent;
  --background-activated: var(--background);
  --background-focused: var(--background);
  --background-activated-opacity: 1;
  --background-focused-opacity: 1;
}

ion-button::part(native) {
  padding: 0;
  height: 3.5rem;
  -webkit-tap-highlight-color: transparent;
}

ion-button::part(native):focus {
  outline: none;
}
</style>