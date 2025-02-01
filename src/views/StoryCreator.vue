<template>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
  <ion-page>
    <ion-content class="ion-padding bg-cream dark:bg-gray-900">
      <div class="tailwind container mx-auto px-4 max-w-6xl">
        <!-- Title with decorative border -->
        <h1 class="text-5xl font-stack text-primary text-center font-bold mb-12 mt-8
                   dark:text-teal-400 drop-shadow-lg relative">
          <span class="relative inline-block px-8 py-2 border-4 border-primary dark:border-teal-400 
                       rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            Dreamweaver
          </span>
        </h1>
        
        <!-- Story options with Font Awesome icons -->
        <div class="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto mb-12 px-5" v-if="!submitted">
          <ion-button expand="block" @click="shuffleStory" :disabled="isLoading"
                    class="flex-1 h-14 rounded-full shadow-lg bg-teal-500 hover:bg-teal-600
                           transition-all duration-300 font-stack text-lg">
            <font-awesome-icon :icon="['fas', 'shuffle']" class="mr-2 text-xl" />
            Random Story
          </ion-button>
          
          <ion-button expand="block" @click="showForm = !showForm" :disabled="isLoading"
                    class="flex-1 h-14 rounded-full shadow-lg bg-coral hover:bg-coral-dark
                           transition-all duration-300 font-stack text-lg">
            <font-awesome-icon :icon="['fas', 'cog']" class="mr-2 text-xl" />
            {{ showForm ? 'Hide Settings' : 'Custom Story' }}
          </ion-button>
        </div>

        <!-- Form with storybook styling -->
        <form v-if="showForm && !submitted" @submit.prevent="handleSubmit" 
              class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6
                     border-4 border-primary dark:border-teal-400 relative
                     transition-all duration-300">
          <!-- Decorative corners -->
          <div class="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-primary dark:border-teal-400 rounded-tl-lg"></div>
          <div class="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-primary dark:border-teal-400 rounded-tr-lg"></div>
          <div class="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-primary dark:border-teal-400 rounded-bl-lg"></div>
          <div class="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-primary dark:border-teal-400 rounded-br-lg"></div>

          <!-- Form fields with whimsical styling -->
          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Hero Name</ion-label>
            <ion-input v-model="heroName" required class="form-input font-comic text-lg"></ion-input>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Hero Gender</ion-label>
            <ion-select v-model="heroGender" required class="form-input font-comic text-lg">
              <ion-select-option value="boy">Boy</ion-select-option>
              <ion-select-option value="girl">Girl</ion-select-option>
              <ion-select-option value="neutral">Gender Neutral</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Setting</ion-label>
            <ion-input v-model="setting" placeholder="e.g., magical forest, space station, underwater city"
                       required class="form-input font-comic text-lg"></ion-input>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Hero's Special Quality</ion-label>
            <ion-input v-model="specialQuality" placeholder="e.g., can talk to animals, very brave, super smart"
                       required class="form-input font-comic text-lg"></ion-input>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Story Theme</ion-label>
            <ion-select v-model="theme" required class="form-input font-comic text-lg">
              <ion-select-option value="friendship">Friendship</ion-select-option>
              <ion-select-option value="courage">Courage</ion-select-option>
              <ion-select-option value="kindness">Kindness</ion-select-option>
              <ion-select-option value="perseverance">Never Give Up</ion-select-option>
              <ion-select-option value="creativity">Creative Problem Solving</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Language / Langue</ion-label>
            <ion-select v-model="language" required class="form-input font-comic text-lg">
              <ion-select-option value="french">Français</ion-select-option>
              <ion-select-option value="english">English</ion-select-option>
              <ion-select-option value="spanish">Español</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Additional Details</ion-label>
            <ion-textarea v-model="additionalDetails" rows="3"
                          placeholder="Any other details about your hero or the story"
                          class="form-input font-comic text-lg"></ion-textarea>
          </ion-item>

          <ion-item class="rounded-xl overflow-hidden border-2 border-primary dark:border-teal-400 bg-cream dark:bg-gray-700">
            <ion-label position="floating" class="font-stack text-lg text-primary dark:text-teal-400">Illustration Style</ion-label>
            <ion-select v-model="illustrationStyle" required class="form-input font-comic text-lg">
              <ion-select-option value="whimsical">Whimsical</ion-select-option>
              <ion-select-option value="cartoon">Cartoon</ion-select-option>
              <ion-select-option value="watercolor">Watercolor</ion-select-option>
              <ion-select-option value="modern">Modern</ion-select-option>
              <ion-select-option value="manga">Manga</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button type="submit" expand="block"
                    class="h-14 rounded-full shadow-xl mt-8 font-stack text-xl
                           bg-primary dark:bg-teal-500 hover:bg-primary-dark dark:hover:bg-teal-600
                           transition-all duration-300">
            {{ isLoading ? 'Creating Story...' : 'Create a Story' }}
          </ion-button>
        </form>

        <!-- Story display with book-like styling -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" 
             class="story-container max-w-6xl mx-auto bg-white dark:bg-gray-800 
                    rounded-3xl shadow-2xl overflow-hidden transition-all duration-300
                    border-4 border-primary dark:border-teal-400">
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
          <div class="p-8 relative">
            <!-- Title styling -->
            <h2 v-if="currentPage === 0" 
                class="text-4xl font-stack text-primary text-center mb-12
                       dark:text-teal-400 drop-shadow-lg">
              <span class="relative inline-block px-8 py-2 border-4 border-primary dark:border-teal-400 
                           rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                {{ storyTitle }}
              </span>
            </h2>
            
            <!-- Story layout grid -->
            <div class="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <!-- Image section -->
              <div class="story-image-container order-2 lg:order-1">
                <div v-if="pageImages[currentPage]" 
                     class="rounded-3xl overflow-hidden shadow-xl border-4 border-primary dark:border-teal-400
                            transition-transform duration-300 hover:scale-105 bg-white">
                  <img :src="pageImages[currentPage]" 
                       :alt="`Illustration for page ${currentPage + 1}`"
                       class="w-full h-auto"
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
              <div class="story-text-container order-1 lg:order-2">
                <div class="relative">
                  <!-- Decorative top border -->
                  <div class="absolute -top-4 left-0 right-0 h-4 bg-repeat-x"
                       style="background-image: url('/images/floral-border.png')"></div>
                  
                  <!-- Story text -->
                  <div class="bg-cream dark:bg-gray-700 p-8 rounded-3xl shadow-lg
                              border-4 border-primary dark:border-teal-400">
                    <p class="font-comic text-xl leading-relaxed text-gray-800 dark:text-gray-200
                              whitespace-pre-wrap">
                      {{ storyPages[currentPage] }}
                    </p>
                  </div>
                  
                  <!-- Decorative bottom border -->
                  <div class="absolute -bottom-4 left-0 right-0 h-4 bg-repeat-x transform rotate-180"
                       style="background-image: url('/images/floral-border.png')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating audio control -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" 
             class="fixed top-6 right-6 z-50 md:top-8 md:right-8">
          <ion-button @click="readPage"
                    :color="isSpeaking ? 'danger' : 'primary'"
                    class="w-14 h-14 rounded-full shadow-lg hover:shadow-xl
                           transition-all duration-300"
                    :disabled="!isAudioReady || isCurrentPageLoading">
            <font-awesome-icon :icon="['fas', isSpeaking ? 'volume-mute' : isAudioReady ? 'volume-high' : 'cloud-arrow-down']"
                             class="text-2xl" />
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
  faRandom, 
  faCog, 
  faChevronLeft, 
  faChevronRight, 
  faSpinner,
  faVolumeUp,
  faVolumeMute,
  faCloudDownloadAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';

// Add Font Awesome icons to library
library.add(
  faRandom, 
  faCog, 
  faChevronLeft, 
  faChevronRight, 
  faSpinner,
  faVolumeUp,
  faVolumeMute,
  faCloudDownloadAlt
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
    FontAwesomeIcon
  },
  setup() {
    const router = useRouter();
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
    const isLoading = ref(false);
    const currentPage = ref(0);
    const storyPages = ref([]);
    const pageImages = ref({});
    const storyTitle = ref('');
    const isGeneratingImage = ref(false);
    const isSpeaking = ref(false);
    const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    let utterance = null;
    const illustrationStyle = ref('whimsical'); // Default style
    const shouldContinueReading = ref(false);
    const showForm = ref(false);
    
    // Add audio cache and pre-buffering functionality
    const audioCache = ref<{ [key: number]: Blob }>({});
    const isPreloading = ref<{ [key: number]: boolean }>({});
    
    // Add a ref to store the current audio element
    const currentAudio = ref<HTMLAudioElement | null>(null);
    
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
            model: "gpt-4o",
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

    // Add a new function to analyze the page content
    const analyzePageContent = async (pageContent, pageNumber) => {
      try {
        const analysisPrompt = `Given this story page content, create a clear, focused description of the single most important moment to illustrate:
${pageContent}

Focus on:
1. The exact moment/action to capture
2. Character's pose and expression
3. Key visual elements in the scene
4. Lighting and atmosphere
5. Important objects or background elements

Provide the description in a single, clear paragraph focused only on the visual elements. Do not include any story elements that cannot be seen. Do not include any text formatting or labels.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{
              role: "user",
              content: analysisPrompt
            }],
            temperature: 0.7,
            max_tokens: 200
          })
        });

        const data = await response.json();
        // Clean up any formatting or labels that might be in the response
        return data.choices[0].message.content
          .replace(/Scene:|Description:|Illustration:|Page \d+:/gi, '')
          .replace(/^\s*[-*]\s*/gm, '')
          .trim();
      } catch (error) {
        console.error('Error analyzing page content:', error);
        return null;
      }
    };

    // Update the generateAllImages function
    const generateAllImages = async () => {
      // Get detailed character description first
      const detailedCharacterDescription = await retryOperation(getDetailedCharacterDescription);
      
      if (!detailedCharacterDescription) {
        console.error('Failed to generate character description after retries');
        return;
      }

      // Process each page sequentially
      for (let index = 0; index < storyPages.value.length; index++) {
        try {
          // Analyze the page content
          const pageAnalysis = await retryOperation(() => 
            analyzePageContent(storyPages.value[index], index + 1)
          );

          if (!pageAnalysis) {
            throw new Error('Failed to analyze page content');
          }

          // Generate image with combined character and scene information
          const generateImage = async () => {
            try {
              // Get style description based on selected style
              const styleGuide = {
                whimsical: "Whimsical and playful children's book style with soft colors and rounded shapes, similar to Oliver Jeffers or Maurice Sendak",
                cartoon: "Bold, cartoon-style illustrations with vibrant colors and clean lines, like Dr. Seuss or Richard Scarry",
                watercolor: "Gentle watercolor illustrations with flowing textures and soft edges, similar to Beatrix Potter or Holly Hobbie",
                modern: "Modern, minimalist style with geometric shapes and bold color blocks, like Jon Klassen or Christian Robinson",
                manga: "Cute manga/anime inspired style with big eyes and expressive characters, similar to Studio Ghibli's children's books"
              }[illustrationStyle.value];

              const imagePrompt = `Create a dynamic children's book illustration for this specific scene:

SCENE DESCRIPTION (Primary Focus):
${pageAnalysis}

CHARACTER APPEARANCE (Reference):
${detailedCharacterDescription}

ARTISTIC STYLE (Most Important):
${styleGuide}

ARTISTIC REQUIREMENTS:
1. Scene Composition:
- Focus on capturing the action/moment described in the scene
- Show the scene from the most dramatic or interesting angle
- Create depth with foreground, middle-ground, and background elements
- Place ${heroName.value} in a dynamic pose that matches the current action
- Set in ${setting.value} with appropriate atmosphere and mood

2. Character Integration:
- Maintain consistent character design while showing them engaged in the scene's action
- Express appropriate emotions for the moment
- Ensure character is properly integrated into the environment

3. Technical Details:
- Dramatic composition using rule of thirds
- Clear focus on the main action
- Professional lighting that enhances the scene
- Natural perspective and scale

Important: This is page ${index + 1} of 5 - The primary focus should be on illustrating this specific action: ${pageAnalysis.split('\n')[0]}`.slice(0, 1000);

              const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                  prompt: imagePrompt,
                  model: 'dall-e-3',
                  n: 1,
                  size: "1024x1024",
                  quality: "standard",
                  style: "natural"
                })
              });

              if (!response.ok) {
                const errorData = await response.json();
                if (Capacitor.isNativePlatform()) {
                  // @ts-ignore
                  Capacitor.Console.log({
                    message: `Image generation failed: ${JSON.stringify(errorData)}`,
                    level: 'error'
                  });
                }
                throw new Error(`Failed to generate image: ${JSON.stringify(errorData)}`);
              }

              const data = await response.json();
              if (!data.data || !data.data[0] || !data.data[0].url) {
                throw new Error('Unexpected API response structure');
              }

              return data.data[0].url;
            } catch (error) {
              if (Capacitor.isNativePlatform()) {
                // @ts-ignore
                Capacitor.Console.log({
                  message: `Image generation error: ${error.message}`,
                  level: 'error'
                });
              }
              console.error('Image generation error:', error);
              throw error;
            }
          };

          // Try to generate the image with retries
          const imageUrl = await retryOperation(generateImage);
          pageImages.value[index] = imageUrl;

          // Add delay between pages
          if (index < storyPages.value.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate image for page ${index + 1}:`, error);
          // Set a placeholder or error state for this image
          pageImages.value[index] = null;
        }
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

    // Update the handleSubmit function to use language-specific prompts
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

        const prompt = `${langPrompt.title}

${langPrompt.character.name}
${langPrompt.character.gender}
${langPrompt.character.ability}
${langPrompt.character.setting}
${langPrompt.character.details}

${langPrompt.theme}
${langPrompt.format}

Create a children's story with exactly 5 pages. Return the response in this exact JSON format:

{
  "title": "Story Title",
  "pages": [
    {
      "pageNumber": 1,
      "content": "Content of page 1 without any formatting or section markers"
    },
    {
      "pageNumber": 2,
      "content": "Content of page 2 without any formatting or section markers"
    },
    {
      "pageNumber": 3,
      "content": "Content of page 3 without any formatting or section markers"
    },
    {
      "pageNumber": 4,
      "content": "Content of page 4 without any formatting or section markers"
    },
    {
      "pageNumber": 5,
      "content": "Content of page 5 without any formatting or section markers"
    }
  ]
}

Requirements:
- Write the entire story in ${language.value === 'french' ? 'French' : language.value === 'spanish' ? 'Spanish' : 'English'}
- Each page's content should be a single paragraph or two of pure story content
- Do not include any section titles, page numbers, or formatting markers
- Do not include "Introduction", "Chapter", or any other structural text
- Content should be pure narrative text that can be displayed directly
- Each page should contain 150-200 words of story content
- Maintain consistent narrative flow between pages
- Use age-appropriate language and vocabulary for 5-8 year olds
- Include dialogue and descriptive scenes
- Keep the story engaging and fun`;

        console.log('Making OpenAI API request with prompt length:', prompt.length);

        const makeStoryRequest = async () => {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [{
                role: "user",
                content: prompt
              }],
              temperature: 0.8,
              max_tokens: 1500,
              response_format: { type: "json_object" }
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw errorData;
          }

          return response.json();
        };

        const data = await retryOperation(makeStoryRequest);
        console.log('OpenAI API response received:', {
          hasChoices: !!data.choices,
          choicesLength: data.choices?.length,
          firstChoiceLength: data.choices?.[0]?.message?.content?.length
        });

        let storyData;
        try {
          storyData = JSON.parse(data.choices[0].message.content);
          console.log('Successfully parsed story data:', {
            hasTitle: !!storyData.title,
            pagesCount: storyData.pages?.length,
            firstPageLength: storyData.pages?.[0]?.content?.length
          });
        } catch (parseError) {
          console.error('Failed to parse story data:', {
            error: parseError,
            rawContent: data.choices[0].message.content
          });
          throw new Error('Failed to parse story response');
        }
        
        // Set the story title and pages directly from the JSON structure
        storyTitle.value = storyData.title;
        storyPages.value = storyData.pages.map(page => page.content);
        currentPage.value = 0;
        pageImages.value = {};
        
        console.log('Story setup complete:', {
          title: storyTitle.value,
          pageCount: storyPages.value.length,
          currentPage: currentPage.value
        });
        
        // Remove main loading spinner as soon as we have the story
        isLoading.value = false;
        
        // Start generating images in the background
        console.log('Starting background image generation...');
        generateAllImages().catch(error => {
          console.error('Error generating images:', error);
        });

      } catch (error) {
        console.error('Story creation error:', {
          error,
          message: error.message,
          stack: error.stack,
          isLoading: isLoading.value,
          submitted: submitted.value
        });
        story.value = `Error: ${error.message || 'Unknown error occurred'}`;
        isLoading.value = false;

        // Log additional context if available
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: await error.response.text().catch(() => 'Failed to get response text')
          });
        }

        // Check API key
        if (!import.meta.env.VITE_OPENAI_API_KEY) {
          console.error('OpenAI API key is missing');
        }
      }
    };

    // Update the nextPage function
    const nextPage = async () => {
      // Use shouldContinueReading instead of checking isSpeaking
      const wasReading = shouldContinueReading.value || isSpeaking.value;
      console.log('nextPage - Was reading:', wasReading);
      console.log('nextPage - Current page before:', currentPage.value);
      
      // Don't stop speaking if we're continuing to the next page
      if (!wasReading) {
        stopSpeaking();
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
              isSpeaking.value = false;
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
      const wasReading = isSpeaking.value;
      stopSpeaking();
      if (currentPage.value > 0) {
        currentPage.value--;
        // If we were reading, continue reading on the new page
        if (wasReading) {
          setTimeout(() => readPage(), 100);
        }
      }
    };

    // Add a function to get the appropriate model for each language
    const getModelId = (lang: string) => {
      switch (lang) {
        case 'french':
          return 'eleven_multilingual_v2';  // Better for French
        case 'spanish':
          return 'eleven_multilingual_v2';  // Better for Spanish
        case 'english':
          return 'eleven_monolingual_v1';   // Optimized for English
        default:
          return 'eleven_multilingual_v2';
      }
    };

    // Function to fetch audio for a specific page
    const fetchAudioForPage = async (pageIndex: number) => {
      if (audioCache.value[pageIndex] || isPreloading.value[pageIndex]) {
        return;
      }

      try {
        isPreloading.value[pageIndex] = true;
        const text = storyPages.value[pageIndex];
        if (!text) return;

        const apiKey = verifyApiKey();
        const voiceId = getVoiceId(language.value);
        
        const requestBody = {
          text: text,
          model_id: getModelId(language.value),
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.7,
            speaker_boost: true
          }
        };

        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
            'User-Agent': 'Dreamweaver/1.0',
            'Accept-Language': language.value === 'french' ? 'fr-FR' : 
                             language.value === 'spanish' ? 'es-ES' : 'en-US'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch audio for page ${pageIndex + 1}`);
        }

        const audioBlob = await response.blob();
        audioCache.value[pageIndex] = audioBlob;
        console.log(`Pre-loaded audio for page ${pageIndex + 1}`);
      } catch (error) {
        console.error(`Error pre-loading audio for page ${pageIndex + 1}:`, error);
      } finally {
        isPreloading.value[pageIndex] = false;
      }
    };

    // Pre-fetch next page's audio
    const preloadNextPageAudio = () => {
      const nextPage = currentPage.value + 1;
      if (nextPage < storyPages.value.length) {
        fetchAudioForPage(nextPage);
      }
    };

    // Update the readPage function
    const readPage = async () => {
      // Only stop if we're speaking and not continuing to next page
      if (isSpeaking.value && !shouldContinueReading.value) {
        stopSpeaking();
        return;
      }

      const pageIndex = currentPage.value;
      if (!storyPages.value[pageIndex]) {
        console.error('No text content found for page:', pageIndex);
        return;
      }

      try {
        // Reset the flags at the start of new reading
        shouldContinueReading.value = false;
        isSpeaking.value = true;

        // Rest of the function remains the same...
        let audioBlob;
        if (audioCache.value[pageIndex]) {
          console.log(`Using cached audio for page ${pageIndex + 1}`);
          audioBlob = audioCache.value[pageIndex];
        } else {
          console.log(`Fetching audio for page ${pageIndex + 1}`);
          await fetchAudioForPage(pageIndex);
          audioBlob = audioCache.value[pageIndex];
        }

        if (!audioBlob) {
          throw new Error('Failed to get audio content');
        }

        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        currentAudio.value = audio;  // Store the audio element
        
        audio.onloadedmetadata = () => {
          console.log('Audio duration:', audio.duration, 'seconds');
        };
        
        audio.onended = () => {
          console.log('Audio playback completed');
          currentAudio.value = null;
          console.log('Current page:', currentPage.value);
          console.log('Total pages:', storyPages.value.length);
          
          if (currentPage.value < storyPages.value.length - 1) {
            console.log('Scheduling next page transition');
            // Pre-fetch the next-next page's audio
            const nextNextPage = currentPage.value + 2;
            if (nextNextPage < storyPages.value.length) {
              fetchAudioForPage(nextNextPage);
            }
            
            // Set the flag before transitioning
            shouldContinueReading.value = true;
            isSpeaking.value = true;  // Keep speaking state true during transition
            
            setTimeout(() => {
              console.log('Executing next page transition');
              nextPage();
            }, 1000);
          } else {
            console.log('Reached end of story - stopping playback');
            shouldContinueReading.value = false;
            isSpeaking.value = false;
          }
          URL.revokeObjectURL(url);
        };

        // Add more audio event handlers for debugging
        audio.onpause = () => console.log('Audio paused');
        audio.onplay = () => console.log('Audio started playing');
        audio.onstalled = () => console.log('Audio playback stalled');
        audio.onsuspend = () => console.log('Audio loading suspended');
        audio.onwaiting = () => console.log('Audio waiting for data');
        audio.onabort = () => console.log('Audio playback aborted');

        // Add loading event handlers
        audio.onloadstart = () => console.log('Audio loading started');
        audio.oncanplay = () => console.log('Audio can start playing');
        audio.onplaying = () => console.log('Audio started playing');

        console.log('Attempting to play audio...');
        await audio.play();
        console.log('Audio play command issued successfully');

        // Pre-fetch next page's audio while current page is playing
        preloadNextPageAudio();

      } catch (error) {
        currentAudio.value = null;
        console.error('Speech synthesis error:', error);
        isSpeaking.value = false;
        shouldContinueReading.value = false;
        alert('Speech synthesis failed. Please try again.');
      }
    };

    // Update the stopSpeaking function
    const stopSpeaking = () => {
      console.log('stopSpeaking called - Previous states:', {
        isSpeaking: isSpeaking.value,
        shouldContinueReading: shouldContinueReading.value
      });
      
      // Stop and cleanup current audio if it exists
      if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
        currentAudio.value.src = '';
        currentAudio.value = null;
      }

      // Only reset flags if we're not in auto-play mode
      if (!shouldContinueReading.value) {
        isSpeaking.value = false;
      }
      
      console.log('stopSpeaking completed - New states:', {
        isSpeaking: isSpeaking.value,
        shouldContinueReading: shouldContinueReading.value
      });
    };

    // Update the verifyApiKey function
    const verifyApiKey = () => {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error('ElevenLabs API key is missing. Please check your .env file.');
      }
      // Only check if it's exactly the placeholder value
      if (apiKey === 'your-api-key-here') {
        throw new Error('Please replace the placeholder API key with your actual ElevenLabs API key.');
      }
      return apiKey;
    };

    // Add a computed property to show available voices (for debugging)
    const availableVoices = computed(() => {
      return speechSynthesis.getVoices().map(voice => ({
        name: voice.name,
        lang: voice.lang,
        isNeural: voice.name.includes('Neural')
      }));
    });

    // Update the shuffleStory function
    const shuffleStory = async () => {
      try {
        console.log('Starting random story settings generation...');
        isLoading.value = true;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{
              role: "user",
              content: `Generate random, creative settings for a children's story in French. Return as JSON:
              {
                "heroName": "string (French name)",
                "heroGender": "boy|girl",
                "setting": "string (in French)",
                "specialQuality": "string (in French)",
                "theme": "friendship|courage|kindness|perseverance|creativity",
                "additionalDetails": "string (in French)"
              }
              Make it whimsical and fun for children aged 5-8. All text fields except heroGender should be in French.`
            }],
            temperature: 0.9,
            max_tokens: 500,
            response_format: { type: "json_object" }
          })
        });

        console.log('Random settings API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Random settings API error:', errorData);
          throw new Error(`Failed to get random settings: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Random settings API response received:', {
          hasChoices: !!data.choices,
          choicesLength: data.choices?.length,
          contentLength: data.choices?.[0]?.message?.content?.length
        });

        let settings;
        try {
          settings = JSON.parse(data.choices[0].message.content);
          console.log('Successfully parsed random settings:', settings);
          
          // Validate the required fields
          const requiredFields = ['heroName', 'heroGender', 'setting', 'specialQuality', 'theme', 'additionalDetails'];
          const missingFields = requiredFields.filter(field => !settings[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          // Validate theme is one of the allowed values
          const validThemes = ['friendship', 'courage', 'kindness', 'perseverance', 'creativity'];
          if (!validThemes.includes(settings.theme)) {
            settings.theme = validThemes[0]; // Default to friendship if invalid
          }

          // Validate gender is one of the allowed values
          if (!['boy', 'girl'].includes(settings.heroGender)) {
            settings.heroGender = 'boy'; // Default to boy if invalid
          }

        } catch (parseError) {
          console.error('Failed to parse random settings:', {
            error: parseError,
            rawContent: data.choices[0].message.content
          });
          throw new Error('Failed to parse random settings response');
        }

        // Update the form values
        heroName.value = settings.heroName;
        heroGender.value = settings.heroGender;
        setting.value = settings.setting;
        specialQuality.value = settings.specialQuality;
        theme.value = settings.theme;
        additionalDetails.value = settings.additionalDetails;
        language.value = 'french'; // Always set to French

        console.log('Random settings applied, starting story generation...');
        
        // Automatically submit with the random settings
        await handleSubmit();

      } catch (error) {
        console.error('Random settings generation error:', {
          error,
          message: error.message,
          stack: error.stack
        });
        
        // Check API key
        if (!import.meta.env.VITE_OPENAI_API_KEY) {
          console.error('OpenAI API key is missing');
        }
        
        alert('Failed to generate random story settings. Please try again.');
        isLoading.value = false;
      }
    };

    // Start pre-loading when story is generated
    watch(storyPages, async (newPages) => {
      if (newPages.length > 0) {
        // Pre-fetch first two pages
        await fetchAudioForPage(0);
        if (newPages.length > 1) {
          fetchAudioForPage(1);
        }
      }
    });

    // Clean up audio when component is unmounted
    onUnmounted(() => {
      stopSpeaking();
      audioCache.value = {};
      isPreloading.value = {};
    });

    // Add a computed property to check if audio is ready
    const isAudioReady = computed(() => {
      return audioCache.value[currentPage.value] !== undefined;
    });

    // Add a computed property to check if audio is loading
    const isCurrentPageLoading = computed(() => {
      return isPreloading.value[currentPage.value] || false;
    });

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
      isSpeaking,
      readPage,
      stopSpeaking,
      availableVoices,
      shouldContinueReading,
      showForm,
      shuffleStory,
      isAudioReady,
      isCurrentPageLoading,
      currentAudio
    };
  }
};
</script>