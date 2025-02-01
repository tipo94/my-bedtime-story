<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Story Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent>
        <ion-item>
          <ion-label position="floating">Hero Name</ion-label>
          <ion-input v-model="store.heroName" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Hero Gender</ion-label>
          <ion-select v-model="store.heroGender" required>
            <ion-select-option value="boy">Boy</ion-select-option>
            <ion-select-option value="girl">Girl</ion-select-option>
            <ion-select-option value="neutral">Gender Neutral</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Setting</ion-label>
          <ion-input 
            v-model="store.setting" 
            placeholder="e.g., magical forest, space station, underwater city"
            required
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Hero's Special Quality</ion-label>
          <ion-input 
            v-model="store.specialQuality" 
            placeholder="e.g., can talk to animals, very brave, super smart"
            required
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Story Theme</ion-label>
          <ion-select v-model="store.theme" required>
            <ion-select-option value="friendship">Friendship</ion-select-option>
            <ion-select-option value="courage">Courage</ion-select-option>
            <ion-select-option value="kindness">Kindness</ion-select-option>
            <ion-select-option value="perseverance">Never Give Up</ion-select-option>
            <ion-select-option value="creativity">Creative Problem Solving</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Illustration Style</ion-label>
          <ion-select v-model="store.illustrationStyle" required>
            <ion-select-option value="whimsical">
              <div class="style-option">
                <strong>Whimsical</strong>
                <small>Soft, playful style (like Oliver Jeffers)</small>
              </div>
            </ion-select-option>
            <ion-select-option value="cartoon">
              <div class="style-option">
                <strong>Cartoon</strong>
                <small>Bold, vibrant style (like Dr. Seuss)</small>
              </div>
            </ion-select-option>
            <ion-select-option value="watercolor">
              <div class="style-option">
                <strong>Watercolor</strong>
                <small>Gentle, flowing style (like Beatrix Potter)</small>
              </div>
            </ion-select-option>
            <ion-select-option value="modern">
              <div class="style-option">
                <strong>Modern Minimal</strong>
                <small>Clean, geometric style (like Jon Klassen)</small>
              </div>
            </ion-select-option>
            <ion-select-option value="manga">
              <div class="style-option">
                <strong>Manga-Inspired</strong>
                <small>Cute anime style (like Studio Ghibli)</small>
              </div>
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Language / Langue</ion-label>
          <ion-select v-model="store.language" required>
            <ion-select-option value="french">Français</ion-select-option>
            <ion-select-option value="english">English</ion-select-option>
            <ion-select-option value="spanish">Español</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Additional Details</ion-label>
          <ion-textarea 
            v-model="store.additionalDetails" 
            rows="3"
            placeholder="Any other details about your hero or the story"
          ></ion-textarea>
        </ion-item>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent 
} from '@ionic/vue';
import { useIonPage } from '@/composables/useIonPage';
import { useStoryStore } from '@/stores/storyStore';

const store = useStoryStore();

// Initialize the page handler
useIonPage();
</script>

<style scoped>
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

.style-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.style-option strong {
  color: var(--ion-color-dark);
  font-size: 1em;
}

.style-option small {
  color: var(--ion-color-medium);
  font-size: 0.8em;
}

:host(.dark-theme) .style-option strong {
  color: var(--ion-color-light);
}

:host(.dark-theme) .style-option small {
  color: var(--ion-color-light-shade);
}
</style>
