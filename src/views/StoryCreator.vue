<template>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap" rel="stylesheet">
  <ion-page>
    <ion-content class="ion-padding">
      <div class="container">
        <h1 class="app-title">Dreamweaver</h1>
        
        <!-- Add buttons for shuffle and manual settings -->
        <div class="story-options" v-if="!submitted">
          <ion-button expand="block" @click="shuffleStory" :disabled="isLoading">
            <ion-icon :icon="shuffle" slot="start"></ion-icon>
            Random Story
          </ion-button>
          
          <ion-button expand="block" @click="showForm = !showForm" :disabled="isLoading">
            <ion-icon :icon="settings" slot="start"></ion-icon>
            {{ showForm ? 'Hide Settings' : 'Custom Story' }}
          </ion-button>
        </div>

        <!-- Make the form toggleable -->
        <form v-if="showForm && !submitted" @submit.prevent="handleSubmit">
          <ion-item>
            <ion-label position="floating">Hero Name</ion-label>
            <ion-input v-model="heroName" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Hero Gender</ion-label>
            <ion-select v-model="heroGender" required>
              <ion-select-option value="boy">Boy</ion-select-option>
              <ion-select-option value="girl">Girl</ion-select-option>
              <ion-select-option value="neutral">Gender Neutral</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Setting</ion-label>
            <ion-input 
              v-model="setting" 
              placeholder="e.g., magical forest, space station, underwater city"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Hero's Special Quality</ion-label>
            <ion-input 
              v-model="specialQuality" 
              placeholder="e.g., can talk to animals, very brave, super smart"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Story Theme</ion-label>
            <ion-select v-model="theme" required>
              <ion-select-option value="friendship">Friendship</ion-select-option>
              <ion-select-option value="courage">Courage</ion-select-option>
              <ion-select-option value="kindness">Kindness</ion-select-option>
              <ion-select-option value="perseverance">Never Give Up</ion-select-option>
              <ion-select-option value="creativity">Creative Problem Solving</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Language / Langue</ion-label>
            <ion-select v-model="language" required>
              <ion-select-option value="french">Français</ion-select-option>
              <ion-select-option value="english">English</ion-select-option>
              <ion-select-option value="spanish">Español</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Additional Details</ion-label>
            <ion-textarea 
              v-model="additionalDetails" 
              rows="3"
              placeholder="Any other details about your hero or the story"
            ></ion-textarea>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Illustration Style</ion-label>
            <ion-select v-model="illustrationStyle" required>
              <ion-select-option value="whimsical">Whimsical</ion-select-option>
              <ion-select-option value="cartoon">Cartoon</ion-select-option>
              <ion-select-option value="watercolor">Watercolor</ion-select-option>
              <ion-select-option value="modern">Modern</ion-select-option>
              <ion-select-option value="manga">Manga</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button 
            type="submit" 
            expand="block"
            class="ion-margin-top submit-button"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Creating Story...' : 'Create a Story' }}
          </ion-button>
        </form>

        <ion-spinner v-if="isLoading" class="spinner-center"></ion-spinner>

        <!-- Only show the story container when we have story content and not loading -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" class="story-container">
          <div class="story-navigation">
            <ion-button 
              @click="previousPage" 
              :disabled="currentPage === 0"
              class="nav-button"
              fill="clear"
            >
              <ion-icon :icon="chevronBack" />
            </ion-button>
            <span>{{ currentPage + 1 }}/{{ storyPages.length }}</span>
            <ion-button 
              @click="nextPage" 
              :disabled="currentPage === storyPages.length - 1"
              class="nav-button"
              fill="clear"
            >
              <ion-icon :icon="chevronForward" />
            </ion-button>
          </div>

          <div class="story-page">
            <h2 v-if="currentPage === 0">{{ storyTitle }}</h2>
            <div class="story-content">
              <div class="story-image-container">
                <div v-if="pageImages[currentPage]" class="story-image">
                  <img 
                    :src="pageImages[currentPage]" 
                    :alt="`Illustration for page ${currentPage + 1}`"
                    @error="pageImages[currentPage] = null"
                  >
                </div>
                <div v-else class="image-loading">
                  <ion-spinner></ion-spinner>
                  <p>Generating illustration for page {{ currentPage + 1 }}...</p>
                </div>
              </div>
              <div class="story-text-container">
                <p class="story-text">{{ storyPages[currentPage] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Update the floating button -->
        <div v-if="submitted && storyPages.length > 0 && !isLoading" class="floating-audio-control">
          <ion-button 
            @click="readPage"
            :color="isSpeaking ? 'danger' : 'primary'"
            class="floating-button"
            :disabled="!isAudioReady || isCurrentPageLoading"
          >
            <ion-icon 
              :icon="isSpeaking ? 'volume-mute' : isAudioReady ? 'volume-high' : 'cloud-download'"
              slot="icon-only"
              size="large"
            ></ion-icon>
          </ion-button>
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
import { volumeHigh, volumeMute, stopCircle, chevronBack, chevronForward, shuffle, settings, cloudDownload } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';

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
    IonIcon
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
    
    addIcons({
      'volume-high': volumeHigh,
      'volume-mute': volumeMute,
      'stop-circle': stopCircle,
      'chevron-back': chevronBack,
      'chevron-forward': chevronForward,
      'shuffle': shuffle,
      'settings': settings,
      'cloud-download': cloudDownload
    });

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

    // Add this new function for retrying failed requests
    const retryWithDelay = async (fn, retries = 3, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (error) {
          if (i === retries - 1) throw error;
          console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
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
      const detailedCharacterDescription = await retryWithDelay(getDetailedCharacterDescription);
      
      if (!detailedCharacterDescription) {
        console.error('Failed to generate character description after retries');
        return;
      }

      // Process each page sequentially
      for (let index = 0; index < storyPages.value.length; index++) {
        try {
          // Analyze the page content
          const pageAnalysis = await retryWithDelay(() => 
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
          const imageUrl = await retryWithDelay(generateImage);
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
        isLoading.value = true;
        submitted.value = true;
        
        const langPrompt = getStoryPrompt(language.value);
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const storyData = JSON.parse(data.choices[0].message.content);
        
        // Set the story title and pages directly from the JSON structure
        storyTitle.value = storyData.title;
        storyPages.value = storyData.pages.map(page => page.content);
        currentPage.value = 0;
        pageImages.value = {};
        
        // Remove main loading spinner as soon as we have the story
        isLoading.value = false;
        
        // Start generating images in the background
        generateAllImages().catch(error => {
          console.error('Error generating images:', error);
        });
      } catch (error) {
        console.error('Full error details:', error);
        story.value = `Error: ${error.message || 'Unknown error occurred'}`;
        isLoading.value = false;
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
                "theme": "string",
                "additionalDetails": "string (in French)"
              }
              Make it whimsical and fun for children aged 5-8. All text fields except heroGender should be in French.`
            }],
            temperature: 0.9,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get random settings');
        }

        const data = await response.json();
        const settings = JSON.parse(data.choices[0].message.content);

        // Update the form values and force French language
        heroName.value = settings.heroName;
        heroGender.value = settings.heroGender;
        setting.value = settings.setting;
        specialQuality.value = settings.specialQuality;
        theme.value = settings.theme;
        additionalDetails.value = settings.additionalDetails;
        language.value = 'french'; // Always set to French

        // Automatically submit with the random settings
        handleSubmit();
      } catch (error) {
        console.error('Error getting random settings:', error);
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
      volumeHigh,
      volumeMute,
      chevronBack,
      chevronForward,
      availableVoices,
      shouldContinueReading,
      showForm,
      shuffleStory,
      isAudioReady,
      cloudDownload,
      isCurrentPageLoading,
      currentAudio
    };
  }
};
</script>

<style scoped>
/* Add new app title styles */
.app-title {
  font-family: 'Comic Neue', cursive;
  color: var(--ion-color-primary);
  font-size: 2.5em;
  text-align: center;
  margin: 20px 0 40px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

:host(.dark-theme) .app-title {
  color: var(--ion-color-primary-shade);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

/* Update ion-content styles */
ion-content {
  --background: #f5f5f5;
}

:host(.dark-theme) ion-content {
  --background: var(--ion-color-dark);
}

/* Base styles */
form {
  max-width: 500px;
  margin: 0 auto;
  background: var(--ion-color-light);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Dark mode styles */
:host(.dark-theme) form {
  background: var(--ion-color-dark-shade);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

ion-item {
  margin-bottom: 16px;
  --background: rgba(var(--ion-color-light-rgb), 0.7);
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  margin: 10px 0;
}

:host(.dark-theme) ion-item {
  --background: rgba(var(--ion-color-dark-rgb), 0.7);
}

ion-button {
  --border-radius: 25px;
  font-size: 1.1em;
  margin: 10px 0;
  --box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Story display styles */
.story-container {
  background: var(--ion-color-light);
  border-radius: 15px;
  padding: 15px;
  margin: 10px auto;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Add new book frame styles */
.story-page {
  text-align: center;
  padding: 40px;
  margin: 0;
  background: #fff;
  border-radius: 3px;
  position: relative;
  color: #000;
  
  /* Book page effect */
  box-shadow: 
    /* Left side spine shadow */
    -5px 0 25px -5px rgba(0, 0, 0, 0.1),
    /* Right side page shadow */
    5px 0 25px -5px rgba(0, 0, 0, 0.1),
    /* Bottom shadow */
    0 4px 25px -5px rgba(0, 0, 0, 0.2);

  /* Book spine effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1),
      transparent 100%
    );
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 3px 0 0 3px;
  }

  /* Page edge effect */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.1);
  }
}

/* Update dark theme styles */
:host(.dark-theme) .story-page {
  background: var(--ion-color-dark-shade);
  
  &::before {
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.05),
      transparent 100%
    );
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  &::after {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* Update story navigation styles */
.story-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0 0 -1px 0;
  padding: 10px 20px;
  background: #f5f5f5;
  border-radius: 15px 15px 0 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  width: 100%;
}

/* Add styles for the navigation container */
.story-navigation span {
  flex: 0 0 60px; /* Fixed width for the page numbers */
  text-align: center;
  font-family: 'Comic Neue', cursive;
  font-size: 1rem;
}

/* Update the nav button styles */
.nav-button {
  --padding-start: 8px;
  --padding-end: 8px;
  min-width: 40px;
  height: 36px;
  margin: 0;
  flex: 0 0 auto; /* Don't allow buttons to grow or shrink */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .story-navigation span {
    flex: 0 0 50px; /* Slightly smaller fixed width on mobile */
    font-size: 0.85rem;
  }

  .nav-button {
    --padding-start: 6px;
    --padding-end: 6px;
    min-width: 32px;
    height: 32px;
  }
}

/* Update story content styles */
.story-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
}

:host(.dark-theme) .story-content {
  background: 
    repeating-linear-gradient(
      var(--ion-color-dark) 0px,
      var(--ion-color-dark) 24px,
      var(--ion-color-medium-shade) 25px
    );
}

/* Update story text container styles */
.story-text-container {
  flex: 1;
  min-width: 280px;
  padding: 15px;
  position: relative;
}

:host(.dark-theme) .story-text-container {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
}

/* Update story text styles */
.story-text {
  font-family: 'Short Stack', 'Comic Neue', cursive;
  font-size: 1.2em;
  line-height: 1.8;
  text-align: left;
  margin: 0;
  white-space: pre-wrap;
  color: inherit;
  font-weight: 500;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
}

:host(.dark-theme) .story-text {
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Update story image container styles */
.story-image-container {
  flex: 1;
  min-width: 280px;
  max-width: 100%;
  padding: 15px;
}

:host(.dark-theme) .story-image-container {
  background: var(--ion-color-dark-shade);
}

h2 {
  font-family: 'Comic Neue', cursive;
  color: var(--ion-color-primary);
  font-size: 2.2em;
  margin: 20px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  font-weight: 700;
}

:host(.dark-theme) h2 {
  color: var(--ion-color-primary-shade);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

/* Update spinner styles */
.spinner-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-center::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: -1;
}

:host(.dark-theme) .spinner-center::before {
  background: rgba(0, 0, 0, 0.9);
}

.spinner-center ion-spinner {
  width: 48px;
  height: 48px;
  --color: var(--ion-color-primary);
}

/* Add styles for the image loading state */
.image-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  gap: 15px;
  padding: 20px;
}

.image-loading p {
  margin: 0;
  color: var(--ion-color-medium);
  font-family: 'Comic Neue', cursive;
}

:host(.dark-theme) .image-loading p {
  color: var(--ion-color-medium-tint);
}

/* Custom button styles */
ion-button.nav-button {
  --background: var(--ion-color-warning);
  --background-hover: var(--ion-color-warning-shade);
  --color: var(--ion-color-warning-contrast);
  min-width: 40px;
  height: 36px;
  margin: 0 5px;
}

.nav-button ion-icon {
  font-size: 20px;
}

/* Form input styles */
ion-label {
  font-size: 1.1em !important;
  color: var(--ion-color-medium) !important;
  font-weight: 600 !important;
}

ion-input, ion-textarea, ion-select {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --background: rgba(var(--ion-color-light-rgb), 0.9);
  font-size: 1.1em !important;
}

:host(.dark-theme) ion-input,
:host(.dark-theme) ion-textarea,
:host(.dark-theme) ion-select {
  --background: rgba(var(--ion-color-dark-rgb), 0.9);
}

/* Submit button */
.submit-button {
  --background: var(--ion-color-success);
  --background-hover: var(--ion-color-success-shade);
  font-size: 1.2em;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

/* Dark mode specific overrides */
:host(.dark-theme) {
  --ion-background-color: var(--ion-color-dark);
  --ion-text-color: var(--ion-color-light);
  --ion-border-color: var(--ion-color-dark-shade);
}

/* Update responsive styles */
@media (max-width: 768px) {
  .container {
    padding: 5px;
  }

  .story-container {
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
  }

  .story-content {
    gap: 10px;
  }

  .story-image-container,
  .story-text-container {
    padding: 10px;
    min-width: 100%;
  }

  .story-text {
    font-size: 1rem;
    line-height: 1.5;
  }

  h2 {
    font-size: 1.6em;
    margin: 10px 0;
  }

  .story-navigation {
    padding: 8px 15px;
  }

  .story-navigation span {
    font-size: 0.85em;
    min-width: 50px;
  }

  .story-image img {
    border-radius: 10px;
    margin: 0 auto;
  }

  .story-navigation {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
}

/* Add styles for very small screens */
@media (max-width: 360px) {
  .story-container {
    padding: 8px;
  }

  .story-text {
    font-size: 0.95rem;
  }

  h2 {
    font-size: 1.4em;
  }
}

/* Dark mode preference media query */
@media (prefers-color-scheme: dark) {
  :host {
    --ion-background-color: var(--ion-color-dark);
    --ion-text-color: var(--ion-color-light);
    --ion-border-color: var(--ion-color-dark-shade);
  }
}

/* Make sure images maintain aspect ratio */
.story-image img {
  width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.story-image img:hover {
  transform: scale(1.02);
}

/* Add some decoration elements */
.story-text-container::before {
  content: '"';
  font-family: 'Comic Neue', cursive;
  font-size: 4em;
  color: var(--ion-color-primary);
  opacity: 0.2;
  position: absolute;
  top: -10px;
  left: 10px;
}

.audio-controls {
  display: none;
}

.read-button {
  --padding-start: 20px;
  --padding-end: 20px;
}

:host(.dark-theme) .audio-controls {
  border-top-color: rgba(var(--ion-color-medium-rgb), 0.1);
}

/* Add transition for the button color change */
ion-button {
  transition: --background 0.3s ease;
}

.story-options {
  max-width: 500px;
  margin: 0 auto 20px;
  display: flex;
  gap: 10px;
  padding: 0 20px;
}

.story-options ion-button {
  flex: 1;
  height: 50px;
  font-size: 1.1em;
  --border-radius: 25px;
  --box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

:host(.dark-theme) .story-options ion-button {
  --box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

/* Add styles for the floating button */
.floating-audio-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.floating-button {
  --border-radius: 50%;
  width: 56px;
  height: 56px;
  margin: 0;
  --padding-start: 0;
  --padding-end: 0;
  --box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:host(.dark-theme) .floating-button {
  --box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.floating-button:hover {
  transform: scale(1.05);
  --box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

/* Add responsive styles for the floating button */
@media (max-width: 768px) {
  .floating-audio-control {
    top: auto;
    bottom: 20px;
    right: 20px;
  }

  .floating-button {
    width: 48px;
    height: 48px;
  }
}

/* Add styles for the disabled state */
.floating-button:disabled {
  opacity: 0.7;
}

/* Add loading animation for the downloading state */
.floating-button:disabled ion-icon {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>