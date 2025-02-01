import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStoryStore = defineStore('story', () => {
  const heroName = ref('Luna')
  const heroGender = ref('girl')
  const setting = ref('forêt magique')
  const specialQuality = ref('peut parler aux animaux')
  const theme = ref('friendship')
  const language = ref('french')
  const additionalDetails = ref('Elle a un pendentif magique qui brille quand les animaux sont proches. Elle aime aider les créatures perdues à retrouver leur chemin.')
  const illustrationStyle = ref('whimsical')

  return {
    heroName,
    heroGender,
    setting,
    specialQuality,
    theme,
    language,
    additionalDetails,
    illustrationStyle
  }
}) 