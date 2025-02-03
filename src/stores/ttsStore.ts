import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTTSStore = defineStore('tts', () => {
  const isPreloading = ref<{ [key: number]: boolean }>({});
  const audioCache = ref<{ [key: number]: string }>({});
  const isSpeaking = ref(false);
  const currentAudio = ref<HTMLAudioElement | null>(null);
  
  // Get API key once at store initialization
  const API_KEY = import.meta.env.VITE_DREAMWEAVER_API_KEY;
  if (!API_KEY) {
    console.error('Missing DREAMWEAVER API key in environment variables');
  }

  // Create headers object once
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json'
  };

  async function generateSpeech(text: string, language: string = 'en'): Promise<string> {
    try {
      console.log('Starting speech generation with:', { 
        text: text.substring(0, 50), 
        language,
        hasApiKey: !!API_KEY
      });
      
      const response = await fetch('https://airticle-flow.com/api/speech/generate', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          language: language
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Speech generation failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Generate response:', data);

      if (!data.id) {
        throw new Error('No prediction ID received from server');
      }

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Checking speech status (attempt ${attempts}/${maxAttempts})`);

        const statusResponse = await fetch(`https://airticle-flow.com/api/speech/status/${data.id}`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('Status check error:', {
            status: statusResponse.status,
            errorData
          });
          throw new Error(`Status check failed: ${errorData.details?.detail || errorData.error || 'Unknown error'}`);
        }

        const statusData = await statusResponse.json();
        console.log('Status response:', statusData);

        if (statusData.status === 'succeeded') {
          return statusData.output;
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Speech generation failed');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      throw new Error('Speech generation timed out');

    } catch (error) {
      console.error('Speech generation error:', error);
      throw error;
    }
  }

  async function preloadAudio(pageNumber: number, text: string, language: string) {
    if (audioCache.value[pageNumber] || isPreloading.value[pageNumber]) {
      return;
    }

    isPreloading.value[pageNumber] = true;

    try {
      // First, generate the audio
      const generateResponse = await fetch('https://airticle-flow.com/api/speech/generate', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          language: language
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(`Failed to generate audio: ${errorData.message || generateResponse.statusText}`);
      }

      const generateData = await generateResponse.json();
      console.log('Generate response:', generateData);

      if (!generateData.id) {
        throw new Error('No prediction ID received from server');
      }

      // Poll for audio completion
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Checking audio status for page ${pageNumber} (attempt ${attempts}/${maxAttempts})`);

        const statusResponse = await fetch(`https://airticle-flow.com/api/speech/status/${generateData.id}`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('Status check error:', {
            status: statusResponse.status,
            errorData
          });
          throw new Error(`Status check failed: ${errorData.details?.detail || errorData.error || 'Unknown error'}`);
        }

        const statusData = await statusResponse.json();
        console.log('Status response:', statusData);

        if (statusData.status === 'succeeded') {
          audioCache.value[pageNumber] = statusData.output;
          return;
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Audio generation failed');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      throw new Error('Audio generation timed out');

    } catch (error) {
      console.error(`Failed to preload audio for page ${pageNumber}:`, error);
    } finally {
      isPreloading.value[pageNumber] = false;
    }
  }

  function stopSpeaking() {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value.currentTime = 0;
      currentAudio.value = null;
    }
    isSpeaking.value = false;
  }

  async function playAudio(pageNumber: number, text: string, language: string) {
    if (!audioCache.value[pageNumber]) {
      await preloadAudio(pageNumber, text, language);
    }

    if (isSpeaking.value) {
      stopSpeaking();
      return;
    }

    const audioUrl = audioCache.value[pageNumber];
    if (!audioUrl) {
      throw new Error('Audio not available');
    }

    const audio = new Audio(audioUrl);
    currentAudio.value = audio;
    isSpeaking.value = true;

    audio.addEventListener('ended', () => {
      isSpeaking.value = false;
      currentAudio.value = null;
    });

    try {
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      isSpeaking.value = false;
      currentAudio.value = null;
      throw error;
    }
  }

  return {
    isPreloading,
    audioCache,
    isSpeaking,
    currentAudio,
    preloadAudio,
    playAudio,
    stopSpeaking
  };
}); 