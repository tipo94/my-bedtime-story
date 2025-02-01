import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia'

/* Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faArrowLeft,
  faArrowRight,
  faCog,
  faShuffle,
  faSpinner,
  faVolumeHigh,
  faVolumeMute,
  faCloudArrowDown
} from '@fortawesome/free-solid-svg-icons'

// Create Pinia instance
const pinia = createPinia()

// Add icons to library
library.add(
  faArrowLeft,
  faArrowRight,
  faCog,
  faShuffle,
  faSpinner,
  faVolumeHigh,
  faVolumeMute,
  faCloudArrowDown
)

/* Import global styles first */
import './styles/global.css'

/* Import Tailwind CSS first */
import './styles/tailwind.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon);
  
router.isReady().then(() => {
  app.mount('#app');
});
