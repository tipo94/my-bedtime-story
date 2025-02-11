<template>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
  <ion-page>
    <ion-content class="ion-padding">
      <LoadingScreen v-if="store.isLoading" />
      <div v-else class="container min-h-screen flex flex-col relative pb-8 mx-auto max-w-md px-4">
        <!-- Tree Image Container - Only show on main view -->
        <div v-if="store.currentView === 'main'" class="w-full max-w-[500px] mx-auto pb-4">
          <img src="../assets/children_tree.png" alt="Children reading under tree" class="w-full h-auto object-contain" />
        </div>

        <!-- Back Button - Show on all views except main -->
        <button v-if="store.currentView !== 'main'" 
                @click="store.goBack"
                class="mb-8 flex items-center gap-1 text-[#030303] hover:text-gray-600 transition-colors duration-200">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm" />
          <span class="text-xs">Back</span>
        </button>

        <!-- Main Menu -->
        <MainMenu v-if="store.currentView === 'main'"
          @shuffle="shuffleStory"
          @show-form="store.navigateTo('gender')"
          @show-prompt="showPromptModal = true"
          :is-loading="store.isLoading"
        />

        <!-- Story Creation Steps -->
        <GenderSelection v-if="store.currentView === 'gender'" />
        <NameSelection v-if="store.currentView === 'name'" />
        <SettingSelection v-if="store.currentView === 'setting'" />
        <OptionalFields v-if="store.currentView === 'optional'" />
        <StyleSelection v-if="store.currentView === 'style'" />
        <LanguageSelection v-if="store.currentView === 'language'" 
                         @submit="handleSubmit" />

        <!-- Story Display -->
        <StoryDisplay 
          v-if="store.currentView === 'story' && store.storyPages.length > 0 && !store.isLoading"
          :current-page="store.currentPage"
          :story-pages="store.storyPages"
          :page-images="store.pageImages"
          :story-title="store.storyTitle"
          @next-page="nextPage"
          @previous-page="previousPage"
          @read-page="readPage"
          @go-to-main="store.navigateTo('main')"
        />
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
import { useStoryStore } from '@/stores/storyStore';
import MainMenu from '@/components/story/MainMenu.vue';
import GenderSelection from '@/components/story/GenderSelection.vue';
import NameSelection from '@/components/story/NameSelection.vue';
import SettingSelection from '@/components/story/SettingSelection.vue';
import OptionalFields from '@/components/story/OptionalFields.vue';
import StyleSelection from '@/components/story/StyleSelection.vue';
import LanguageSelection from '@/components/story/LanguageSelection.vue';
import StoryDisplay from '@/components/story/StoryDisplay.vue';
import LoadingScreen from '@/components/common/LoadingScreen.vue';

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
    ChevronDownIcon,
    MainMenu,
    GenderSelection,
    NameSelection,
    SettingSelection,
    OptionalFields,
    StyleSelection,
    LanguageSelection,
    StoryDisplay,
    LoadingScreen
  },
  setup() {
    const router = useRouter();
    const ttsStore = useTTSStore();
    const store = useStoryStore();
    const showPromptModal = ref(false);
    
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
      store.storyTitle = lines[0].replace(/^#\s*/, ''); // Remove markdown heading
      
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
              content: `Create a detailed physical description for a character named ${store.heroName} who ${store.specialQuality}. Return as JSON with these fields:
                {
                  "height_build": "description of height and build",
                  "facial_features_skin_tone": "description of face and skin",
                  "hair": "hair description",
                  "eyes": "eyes description",
                  "clothing_accessories": "clothing and accessories description",
                  "distinguishing_features": "any unique features"
                }
                Make it child-friendly and match the character's gender (${store.heroGender}) and setting (${store.setting}).`
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
        for (let i = 0; i < store.storyPages.length; i++) {
          try {
            await ttsStore.preloadAudio(i, store.storyPages[i], store.language);
            // Add delay between requests to avoid rate limiting
            if (i < store.storyPages.length - 1) {
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
      const originalPage = store.currentPage;
      
      // Define art style mapping
      const artStyleMap = {
        cartoon: "cartoon style",
        manga: "anime manga",
        watercolor: "watercolor",
        traditional: "traditional illustration",
        custom: (style: string) => style // Handle custom style directly
      };
      
      // Process each page sequentially
      for (let pageIndex = 0; pageIndex < store.storyPages.length; pageIndex++) {
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
                title: store.storyTitle,
                pages: store.storyPages
              },
              characters: {
                characters: [{
                  name: store.heroName,
                  gender: store.heroGender,
                  ability: store.specialQuality,
                  setting: store.setting,
                  details: store.additionalDetails,
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
              art_style: store.illustrationStyle in artStyleMap 
                ? artStyleMap[store.illustrationStyle] 
                : store.illustrationStyle
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to generate illustration: ${errorData.message || response.statusText}`);
          }

          const data = await response.json();
          store.pageImages[pageIndex] = data.image_url;

          // Add delay between pages
          if (pageIndex < store.storyPages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate image for page ${pageIndex + 1}:`, error);
          store.pageImages[pageIndex] = null;
        }
      }
    };

    // Update handleSubmit to include pre-buffering
    const handleSubmit = async () => {
      try {
        console.log('Starting story creation process...');
        store.isLoading = true;
        store.submitted = true;
        store.showForm = false; // Hide the form after submission
        
        const langPrompt = getStoryPrompt(store.language);
        console.log('Language prompt generated:', {
          language: store.language,
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
              name: store.heroName,
              gender: store.heroGender,
              ability: store.specialQuality,
              setting: store.setting,
              details: store.additionalDetails
            },
            theme: store.theme,
            format: langPrompt.format,
            language: store.language
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Story generation failed: ${errorData.message || response.statusText}`);
        }

        const storyData = await response.json();
        
        // Set the story title and pages from the API response
        store.storyTitle = storyData.title;
        store.storyPages = storyData.pages;
        
        // Update character refs from the response
        if (storyData.character) {
          store.heroName = storyData.character.name || store.heroName;
          store.heroGender = storyData.character.gender || store.heroGender;
          store.setting = storyData.character.setting || store.setting;
          store.specialQuality = storyData.character.ability || store.specialQuality;
          store.additionalDetails = storyData.character.details || store.additionalDetails;
        }
        
        if (storyData.theme) {
          store.theme = storyData.theme;
        }

        store.currentPage = 0;
        store.pageImages = {};
        
        // Navigate to story view
        store.goToNextStep('story');
        
        // Remove main loading spinner
        store.isLoading = false;
        
        // Start pre-buffering audio and generating images in parallel
        Promise.all([
          preBufferAllPages(),
          generateAllImages()
        ]).catch(error => {
          console.error('Error in background tasks:', error);
        });

      } catch (error) {
        console.error('Story creation error:', error);
        store.isLoading = false;
        alert(`Failed to create story: ${error.message}`);
      }
    };

    // Update the nextPage function
    const nextPage = async () => {
      // Use shouldContinueReading instead of checking isSpeaking
      const wasReading = store.shouldContinueReading || ttsStore.isSpeaking;
      console.log('nextPage - Was reading:', wasReading);
      console.log('nextPage - Current page before:', store.currentPage);
      
      // Don't stop speaking if we're continuing to the next page
      if (!wasReading) {
        ttsStore.stopSpeaking();
      }

      if (store.currentPage < store.storyPages.length - 1) {
        store.currentPage++;
        console.log('nextPage - Current page after:', store.currentPage);
        console.log('nextPage - Page content:', store.storyPages[store.currentPage]?.substring(0, 50) + '...');
        
        if (Capacitor.isNativePlatform()) {
          console.log({
            message: `Page ${store.currentPage}`,
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
              store.shouldContinueReading = false;
              ttsStore.isSpeaking = false;
            }
          }, 100);
        }
      } else {
        console.log('nextPage - Reached last page');
        store.shouldContinueReading = false;
      }
    };

    // Update the previousPage function
    const previousPage = () => {
      const wasReading = ttsStore.isSpeaking;
      ttsStore.stopSpeaking();
      if (store.currentPage > 0) {
        store.currentPage--;
        // If we were reading, continue reading on the new page
        if (wasReading) {
          setTimeout(() => readPage(), 100);
        }
      }
    };

    // Update the readPage function
    const readPage = async () => {
      if (ttsStore.isSpeaking) {
        store.shouldContinueReading = false;
        ttsStore.stopSpeaking();
        return;
      }

      try {
        store.shouldContinueReading = true;
        // Check if audio is pre-buffered
        if (!ttsStore.audioCache[store.currentPage]) {
          // If not buffered (fallback), try to load it
          await ttsStore.preloadAudio(
            store.currentPage,
            store.storyPages[store.currentPage],
            store.language
          );
        }
        
        await ttsStore.playAudio(
          store.currentPage,
          store.storyPages[store.currentPage],
          store.language,
          // Add callback for auto-progression
          () => {
            if (store.shouldContinueReading && store.currentPage < store.storyPages.length - 1) {
              nextPage();
            } else {
              store.shouldContinueReading = false;
            }
          }
        );
      } catch (error) {
        console.error('Failed to read page:', error);
        store.shouldContinueReading = false;
        alert('Failed to generate speech. Please try again.');
      }
    };

    // Clean up on unmount
    onUnmounted(() => {
      ttsStore.stopSpeaking();
    });

    // Update computed properties
    const isAudioReady = computed(() => {
      return !!ttsStore.audioCache[store.currentPage];
    });

    const isCurrentPageLoading = computed(() => {
      return ttsStore.isPreloading[store.currentPage] || false;
    });

    const isSpeaking = computed(() => ttsStore.isSpeaking);

    // Update the shuffleStory function
    const shuffleStory = async () => {
      try {
        console.log('Starting random story settings generation...');
        store.isLoading = true;

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
          store.heroName = storyData.character.name || store.heroName;
          store.heroGender = storyData.character.gender || store.heroGender;
          store.setting = storyData.character.setting || store.setting;
          store.specialQuality = storyData.character.ability || store.specialQuality;
          store.additionalDetails = storyData.character.details || store.additionalDetails;
        }
        if (storyData.theme) {
          store.theme = storyData.theme;
        }
        
        

        // Remove main loading spinner
        store.isLoading = false;
        
        // Start generating images in the background
        handleSubmit()

      } catch (error) {
        console.error('Random story generation error:', error);
        alert('Failed to generate random story. Please try again.');
        store.isLoading = false;
      }
    };

    // Add a function to get language-specific prompts
    const getStoryPrompt = (lang: string) => {
      const prompts = {
        french: {
          title: "Créez une histoire pour enfants en français avec les spécifications suivantes:",
          character: {
            name: `Nom: ${store.heroName}`,
            gender: `Genre: ${store.heroGender}`,
            ability: `Capacité spéciale: ${store.specialQuality}`,
            setting: `Lieu: ${store.setting}`,
            details: `Détails: ${store.additionalDetails}`
          },
          theme: `Thème: ${store.theme}`,
          format: "L'histoire doit être écrite en français simple et clair, adaptée aux enfants de 5-8 ans."
        },
        english: {
          title: "Create a children's story in English with the following specifications:",
          character: {
            name: `Name: ${store.heroName}`,
            gender: `Gender: ${store.heroGender}`,
            ability: `Special ability: ${store.specialQuality}`,
            setting: `Setting: ${store.setting}`,
            details: `Details: ${store.additionalDetails}`
          },
          theme: `Theme: ${store.theme}`,
          format: "The story should be written in simple, clear English suitable for children aged 5-8."
        },
        spanish: {
          title: "Crea un cuento infantil en español con las siguientes especificaciones:",
          character: {
            name: `Nombre: ${store.heroName}`,
            gender: `Género: ${store.heroGender}`,
            ability: `Habilidad especial: ${store.specialQuality}`,
            setting: `Escenario: ${store.setting}`,
            details: `Detalles: ${store.additionalDetails}`
          },
          theme: `Tema: ${store.theme}`,
          format: "La historia debe estar escrita en español simple y claro, adecuado para niños de 5-8 años."
        }
      };

      return prompts[lang] || prompts.english;
    };

    const selectGender = (gender: string) => {
      store.heroGender = gender;
      store.goToNextStep('name');
    };

    const selectName = () => {
      if (store.heroName.trim()) {
        store.goToNextStep('setting');
      }
    };

    const settingMap = {
      magical_forest: 'magical forest',
      space_station: 'space station',
      underwater_city: 'underwater city',
      castle: 'medieval castle'
    };

    const selectSetting = (settingKey: string) => {
      store.setting = settingMap[settingKey];
      store.goToNextStep('optional');
    };

    const selectCustomSetting = () => {
      if (store.customSetting.trim()) {
        store.setting = store.customSetting.trim();
        store.goToNextStep('optional');
      }
    };

    const selectTheme = (selectedTheme: string) => {
      store.theme = selectedTheme;
    };

    const startStoryCreation = () => {
      store.goToNextStep('language');
      store.language = 'english';
    };

    const selectLanguage = (selectedLanguage: string) => {
      store.language = selectedLanguage;
    };

    // Add step navigation mapping
    const stepOrder = ['gender', 'name', 'setting', 'optional', 'style', 'language'];

    const goBack = () => {
      const currentIndex = stepOrder.indexOf(store.currentStep);
      if (currentIndex <= 0) {
        // If we're at the first step, go back to main menu
        store.showForm = false;
        store.currentStep = 'gender'; // Reset to first step
      } else {
        // Otherwise go to previous step
        store.currentStep = stepOrder[currentIndex - 1];
      }
    };

    const selectStyle = (style: string) => {
      store.illustrationStyle = style;
      store.goToNextStep('language');
    };

    const selectCustomStyle = () => {
      if (store.customStyle.trim()) {
        store.illustrationStyle = store.customStyle.trim();
        store.goToNextStep('language');
      }
    };

    return { 
      store,
      showPromptModal,
      handleSubmit,
      nextPage,
      previousPage,
      readPage,
      isAudioReady,
      isCurrentPageLoading,
      isSpeaking,
      preBufferAllPages,
      shuffleStory,
      getStoryPrompt,
      selectGender,
      selectName,
      selectSetting,
      selectCustomSetting,
      selectTheme,
      startStoryCreation,
      selectLanguage,
      goBack,
      selectStyle,
      selectCustomStyle,
    };
  }
};
</script>

<style scoped>
/* Make sure gradient covers the entire page */
:deep(ion-page) {
  background: linear-gradient(180deg, #FFFFFF 0%, #9C27B0 100%);
}

:deep(ion-content),
:deep(ion-content::part(scroll)) {
  --background: transparent;
  background: transparent;
}

/* Only keep styles that can't be handled by Tailwind */
.story-button {
  @apply flex items-center justify-center gap-2 px-4 py-3 rounded-full
         text-lg font-medium transition-all duration-200
         text-white border-none cursor-pointer w-full h-14
         hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-70 
         disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none;
}

.primary-button {
  background: linear-gradient(to right, #4A90E2, #5E5CE6);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.secondary-button {
  background: linear-gradient(to right, #9C27B0, #BA68C8);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

.tertiary-button {
  background: linear-gradient(to right, #E91E63, #F48FB1);
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
}

.story-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Glow effect - can't be done with Tailwind */
.primary-button::after,
.secondary-button::after,
.tertiary-button::after {
  content: '';
  @apply absolute inset-0 rounded-full opacity-30 -z-10 transition-all duration-200;
  background: inherit;
  filter: blur(10px);
}

.story-button:hover::after {
  @apply opacity-50;
  filter: blur(15px);
}
</style>