<template>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
  <ion-page>
    <ion-content class="ion-padding bg-cream dark:bg-gray-900">
      <div class="tailwind container w-full flex flex-col sace-y-12 pb-4">
        <!-- Title with decorative border -->
        <h1 class="text-4xl font-stack text-primary text-center font-bold mb-12 mt-8
                   dark:text-teal-400 drop-shadow-lg relative">
          <span class="relative inline-block px-8 py-2 border-4 border-primary dark:border-teal-400 
                       rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            Dreamweaver
          </span>
        </h1>
        
        <!-- Story options with Font Awesome icons -->
        <div class="flex flex-col  gap-6 mx-auto mb-12 px-5" v-if="!submitted">
          <ion-button expand="block" @click="shuffleStory" :disabled="isLoading"
                    class="flex-1 h-14 rounded-full shadow-lg bg-teal-500 hover:bg-teal-600
                           transition-all duration-300 font-stack text-lg">
            <font-awesome-icon :icon="['fas', 'shuffle']" class="mr-2" />
            Random Story
          </ion-button>
          
          <ion-button expand="block" @click="showForm = !showForm" :disabled="isLoading"
                    class="flex-1 h-14 rounded-full shadow-lg bg-coral hover:bg-coral-dark
                           transition-all duration-300 font-stack text-lg">
            <font-awesome-icon :icon="['fas', 'cog']" class="mr-2" />
            {{ showForm ? 'Hide Settings' : 'Custom Story' }}
          </ion-button>
        </div>

        <!-- Form with modern styling -->
        <form v-if="showForm && !submitted" @submit.prevent="handleSubmit" 
              class="mx-auto bg-white/10 rounded-lg shadow-xl p-8 space-y-12 flex flex-col ">
          <div class="border-b border-white/10 pb-12 flex flex-col">
            <h2 class="text-base/7 font-semibold text-white text-center">Story Settings</h2>
            <p class="mt-1 text-sm/6 text-gray-400 text-center">Create a unique story with these magical ingredients.</p>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <!-- Hero Name -->
              <div class="flex flex-col max-w-full">
                <label for="hero-name" class="block text-sm/6 font-medium text-white">Hero Name</label>
                <div class="mt-2 flex">
                  <input type="text" 
                         v-model="heroName"
                         id="hero-name"
                         required
                         class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" />
                </div>
              </div>

              <!-- Hero Gender -->
              <div class="flex flex-col max-w-full">
                <label for="hero-gender" class="block text-sm/6 font-medium text-white">Hero Gender</label>
                <div class="mt-2 flex">
                  <select v-model="heroGender"
                          id="hero-gender"
                          required
                          class="block w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="neutral">Gender Neutral</option>
                  </select>
                  <ChevronDownIcon class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>

              <!-- Setting -->
              <div class="flex flex-col max-w-full">
                <label for="setting" class="block text-sm/6 font-medium text-white">Story Setting</label>
                <div class="mt-2 flex">
                  <input type="text"
                         v-model="setting"
                         id="setting"
                         required
                         placeholder="e.g., magical forest, space station, underwater city"
                         class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <!-- Special Quality -->
              <div class="flex flex-col max-w-full">
                <label for="special-quality" class="block text-sm/6 font-medium text-white">Hero's Special Quality</label>
                <div class="mt-2 flex">
                  <input type="text"
                         v-model="specialQuality"
                         id="special-quality"
                         required
                         placeholder="e.g., can talk to animals, very brave, super smart"
                         class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <!-- Theme -->
              <div class="flex flex-col max-w-full">
                <label for="theme" class="block text-sm/6 font-medium text-white">Story Theme</label>
                <div class="mt-2 flex">
                  <select v-model="theme"
                          id="theme"
                          required
                          class="block w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
                    <option value="friendship">Friendship</option>
                    <option value="courage">Courage</option>
                    <option value="kindness">Kindness</option>
                    <option value="perseverance">Never Give Up</option>
                    <option value="creativity">Creative Problem Solving</option>
                  </select>
                  <ChevronDownIcon class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>

              <!-- Language -->
              <div class="flex flex-col max-w-full">
                <label for="language" class="block text-sm/6 font-medium text-white">Language / Langue</label>
                <div class="mt-2 flex">
                  <select v-model="language"
                          id="language"
                          required
                          class="block w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
                    <option value="french">Français</option>
                    <option value="english">English</option>
                    <option value="spanish">Español</option>
                  </select>
                  <ChevronDownIcon class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>

              <!-- Additional Details -->
              <div class="flex flex-col max-w-full">
                <label for="additional-details" class="block text-sm/6 font-medium text-white">Additional Details</label>
                <div class="mt-2 flex h-56">
                  <textarea v-model="additionalDetails"
                            id="additional-details"
                            rows="3"
                            placeholder="Any other details about your hero or the story"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <!-- Illustration Style -->
              <div class="flex flex-col max-w-full">
                <label for="illustration-style" class="block text-sm/6 font-medium text-white">Illustration Style</label>
                <div class="mt-2 flex">
                  <select v-model="illustrationStyle"
                          id="illustration-style"
                          required
                          class="block w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
                    <option value="whimsical">Whimsical</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="watercolor">Watercolor</option>
                    <option value="modern">Modern</option>
                    <option value="manga">Manga</option>
                  </select>
                  <ChevronDownIcon class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" 
                    @click="showForm = false"
                    class="text-sm/6 font-semibold text-white hover:text-gray-300">
              Cancel
            </button>
            <button type="submit"
                    :disabled="isLoading"
                    class="rounded-md bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Creating Story...' : 'Create Story' }}
            </button>
          </div>
        </form>

        <!-- Story display with book-like styling -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" 
             class="story-conmax-w-full flex flex-col bg-white dark:bg-gray-800 px-8
                    rounded-3xl shadow-2xl overflow-hidden transition-all duration-300
                    border-4 border-primary dark:border-teal-400 pb-8">
          <!-- Story navigation with Font Awesome icons -->
          <div class="flex items-center justify-center gap-8 p-6 bg-cream dark:bg-gray-700
                      border-t-4 border-primary dark:border-teal-400 mt-8">
            <ion-button @click="previousPage" :disabled="currentPage === 0"
                      class="w-14 h-14 rounded-full !p-0 bg-primary dark:bg-teal-500
                             hover:bg-primary-dark dark:hover:bg-teal-600 shadow-lg
                             transition-all duration-300">
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-2xl" />
            </ion-button>
            
            <span class="font-stack text-2xl text-primary dark:text-teal-400 min-w-[120px] text-center">
              {{ currentPage + 1 }} / {{ storyPages.length }}
            </span>
            
            <ion-button @click="nextPage" :disabled="currentPage === storyPages.length - 1"
                      class="w-14 h-14 rounded-full !p-0 bg-primary dark:bg-teal-500
                             hover:bg-primary-dark dark:hover:bg-teal-600 shadow-lg
                             transition-all duration-300">
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-2xl" />
            </ion-button>
          </div>

          <!-- Story content with decorative borders -->
          <div class="flex flex-col">
            <!-- Title styling -->
            <h2 v-if="currentPage === 0" 
                class="text-3xl font-stack text-primary text-center mb-12
                       dark:text-teal-400 ">
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
                                     class="text-3xl text-primary dark:text-teal-400 animate-spin" />
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
                    :color="isSpeaking ? 'danger' : 'primary'"
                    class="w-14 h-14 block rounded-full text-base shadow-lg hover:shadow-xl
                           transition-all duration-300"
                    :disabled="!isAudioReady || isCurrentPageLoading">
            <font-awesome-icon :icon="['fas', isSpeaking ? 'volume-xmark' : isAudioReady ? 'volume-high' : 'cloud-arrow-down']"
                             class="z-20" />
          </ion-button>
        </div>

        <!-- Loading spinner with Font Awesome -->
        <div v-if="isLoading" 
             class="fixed inset-0 bg-white/90 dark:bg-gray-900/90 
                    flex flex-col items-center justify-center z-50">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'spinner']" 
                             class="text-4xl text-primary dark:text-teal-400 animate-spin" />
          </div>
          <p class="mt-4 font-comic text-lg text-primary dark:text-teal-400">
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
  faArrowRight
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
  faArrowRight
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
    const setting = ref('forêt magique');
    const specialQuality = ref('peut parler aux animaux');
    const theme = ref('friendship');
    const language = ref('french'); // Default to French
    const additionalDetails = ref('Elle a un pendentif magique qui brille quand les animaux sont proches. Elle aime aider les créatures perdues à retrouver leur chemin.');
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
        const characterPrompt = `Create a detailed, consistent character description for a children's book illustration:

Main Character Basic Info:
- Name: ${heroName.value}
- Gender: ${heroGender.value}
- Special ability: ${specialQuality.value}
- Setting: ${setting.value}
- Additional details: ${additionalDetails.value}

Please provide a detailed visual description including:
1. Physical appearance (age, height, build)
2. Facial features (eyes, smile, expressions)
3. Hair style and color
4. Clothing style and colors (signature outfit)
5. Distinguishing accessories or items
6. Personality reflected in posture and movement
7. Special visual elements related to their ability
8. Color palette associated with the character

Format the description to be used as a reference for consistent illustration across multiple scenes.`;

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
              content: characterPrompt
            }],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error generating character description:', error);
        return null;
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


    // Update the generateAllImages function
    const generateAllImages = async () => {
      // Store original page number to restore it later
      const originalPage = currentPage.value;
      
      // Define art style mapping
      const artStyleMap = {
        whimsical: "whimsical watercolor",
        cartoon: "cartoon",
        watercolor: "watercolor",
        modern: "modern minimalist",
        manga: "anime"
      };
      
      // Process each page sequentially without affecting display
      for (let pageIndex = 0; pageIndex < storyPages.value.length; pageIndex++) {
        try {
          
          // Generate image for this page using pageIndex directly
          const response = await fetch('https://airticle-flow.com/dreamweaver/illustration', {
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
                characters: characters.value
              },
              art_style: artStyleMap[illustrationStyle.value] || "cartoon"
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

    // Update the handleSubmit function
    const handleSubmit = async () => {
      try {
        console.log('Starting story creation process...');
        isLoading.value = true;
        submitted.value = true;
        
        const langPrompt = getStoryPrompt(language.value);
        console.log('Language prompt generated:', {
          language: language.value,
          promptTitle: langPrompt.title
        });

        // Use the new Dreamweaver API
        const response = await fetch('https://airticle-flow.com/dreamweaver/summary', {
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
            format: langPrompt.format
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
        characters.value = storyData.characters;
        currentPage.value = 0;
        pageImages.value = {};
        
        console.log('Story setup complete:', {
          title: storyTitle.value,
          pageCount: storyPages.value.length,
          currentPage: currentPage.value,
          characters: characters.value
        });
        
        // Remove main loading spinner as soon as we have the story
        isLoading.value = false;
        
        // Start generating images in the background
        console.log('Starting background image generation...');
        generateAllImages().catch(error => {
          console.error('Error generating images:', error);
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

    // Add this watch effect to handle speech completion
    watch(() => ttsStore.isSpeaking, async (newValue, oldValue) => {
      if (oldValue && !newValue && shouldContinueReading.value) {
        // Speech finished and we should continue reading
        if (currentPage.value < storyPages.value.length - 1) {
          await nextPage();
        } else {
          // Reset when we reach the end
          shouldContinueReading.value = false;
        }
      }
    });

    // Update the readPage function
    const readPage = async () => {
      if (ttsStore.isSpeaking) {
        shouldContinueReading.value = false;
        ttsStore.stopSpeaking();
        return;
      }

      try {
        shouldContinueReading.value = true;
        await ttsStore.playAudio(
          currentPage.value,
          storyPages.value[currentPage.value],
          language.value
        );
      } catch (error) {
        console.error('Failed to read page:', error);
        shouldContinueReading.value = false;
        alert('Failed to generate speech. Please try again.');
      }
    };

    // Watch for page changes to preload audio
    watch(storyPages, async (newPages) => {
      if (newPages.length > 0) {
        // Pre-fetch first two pages
        await ttsStore.preloadAudio(0, newPages[0], language.value);
        if (newPages.length > 1) {
          ttsStore.preloadAudio(1, newPages[1], language.value);
        }
      }
    });

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
      isSpeaking
    };
  }
};
</script>