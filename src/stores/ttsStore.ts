import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTTSStore = defineStore('tts', () => {
  const isPreloading = ref<{ [key: number]: boolean }>({});
  const audioCache = ref<{ [key: number]: string }>({});
  const isSpeaking = ref(false);
  const currentAudio = ref<HTMLAudioElement | null>(null);

  async function generateSpeech(text: string, language: string = 'en'): Promise<string> {
    try {
      console.log('Starting speech generation with:', { text: text.substring(0, 50), language });
      
      const response = await fetch("/api/replicate/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_REPLICATE_API_KEY}`
        },
        body: JSON.stringify({
          version: "684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
          input: {
            text: text,
            language: language === 'french' ? 'fr' : 
                     language === 'spanish' ? 'es' : 'en',
            speaker: "https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0LQRL8UcWspg5J4RFrU6YwEKpOT1ukS/male.wav",
            cleanup_voice: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Replicate API error:', errorData);
        throw new Error(`Replicate API error: ${JSON.stringify(errorData)}`);
      }

      const prediction = await response.json();
      console.log('Prediction created:', prediction);
      const predictionId = prediction.id;

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Checking prediction status (attempt ${attempts}/${maxAttempts})`);
        
        const statusResponse = await fetch(
          `/api/replicate/v1/predictions/${predictionId}`,
          {
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_REPLICATE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('Status check error:', errorData);
          throw new Error(`Status check failed: ${JSON.stringify(errorData)}`);
        }

        const result = await statusResponse.json();
        console.log('Prediction status:', result.status);

        if (result.status === "succeeded") {
          console.log('Speech generation successful:', result.output);
          return result.output;
        } else if (result.status === "failed") {
          console.error('Prediction failed:', result);
          throw new Error(`Speech generation failed: ${result.error || 'Unknown error'}`);
        } else if (result.status === "canceled") {
          throw new Error('Speech generation was canceled');
        }

        // Wait before polling again
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
      const audioUrl = await generateSpeech(text, language);
      audioCache.value[pageNumber] = audioUrl;
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