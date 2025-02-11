import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStoryStore = defineStore('story', () => {
  // Story settings
  const heroName = ref('')
  const heroGender = ref('')
  const setting = ref('')
  const specialQuality = ref('')
  const theme = ref('')
  const language = ref('english')
  const additionalDetails = ref('')
  const illustrationStyle = ref('whimsical')
  const customStyle = ref('')
  const customSetting = ref('')

  // Story state
  const isLoading = ref(false)
  const submitted = ref(false)
  const currentPage = ref(0)
  const storyPages = ref<string[]>([])
  const pageImages = ref<Record<number, string>>({})
  const storyTitle = ref('')
  const showForm = ref(false)
  const currentStep = ref('gender')
  const shouldContinueReading = ref(false)

  // Settings maps
  const settingMap = {
    magical_forest: 'magical forest',
    space_station: 'space station',
    underwater_city: 'underwater city',
    castle: 'medieval castle'
  }

  const artStyleMap = {
    cartoon: "cartoon style",
    manga: "anime manga",
    watercolor: "watercolor",
    traditional: "traditional illustration",
    custom: (style: string) => style
  }

  // Navigation
  const stepOrder = ['gender', 'name', 'setting', 'optional', 'style', 'language', 'story']

  const goToPreviousStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep.value)
    if (currentIndex <= 0) {
      showForm.value = false
      currentStep.value = 'gender'
    } else {
      currentStep.value = stepOrder[currentIndex - 1]
    }
  }

  const goToNextStep = (step: string) => {
    currentStep.value = step;
    viewHistory.value.push(step);
  }

  // Reset store
  const resetStore = () => {
    heroName.value = ''
    heroGender.value = ''
    setting.value = ''
    specialQuality.value = ''
    theme.value = ''
    language.value = 'english'
    additionalDetails.value = ''
    illustrationStyle.value = 'whimsical'
    customStyle.value = ''
    customSetting.value = ''
    currentPage.value = 0
    storyPages.value = []
    pageImages.value = {}
    storyTitle.value = ''
    showForm.value = false
    currentStep.value = 'gender'
    submitted.value = false
    shouldContinueReading.value = false
  }

  // Add these to the existing store
  const viewHistory = ref<string[]>(['main']); // Start with main view
  const currentView = computed(() => viewHistory.value[viewHistory.value.length - 1]);

  const navigateTo = (view: string) => {
    viewHistory.value.push(view);
  };

  const goBack = () => {
    if (viewHistory.value.length > 1) {
      viewHistory.value.pop();
    }
  };

  return {
    // State
    heroName,
    heroGender,
    setting,
    specialQuality,
    theme,
    language,
    additionalDetails,
    illustrationStyle,
    customStyle,
    customSetting,
    isLoading,
    submitted,
    currentPage,
    storyPages,
    pageImages,
    storyTitle,
    showForm,
    currentStep,
    shouldContinueReading,
    
    // Maps
    settingMap,
    artStyleMap,
    
    // Actions
    goToPreviousStep,
    goToNextStep,
    resetStore,
    viewHistory,
    currentView,
    navigateTo,
    goBack,
  }
}) 