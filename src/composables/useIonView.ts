import { onMounted, onBeforeUnmount } from 'vue';

export function useIonView() {
  let cleanup: (() => void) | null = null;

  onMounted(() => {
    // Get the closest ion-page parent
    const ionPage = document.querySelector('ion-page');
    if (!ionPage) return;

    // Remove any existing visibility classes
    ionPage.classList.remove('ion-page-hidden');
    ionPage.classList.remove('ion-page-invisible');
    
    // Add base classes
    ionPage.classList.add('ion-page');
    
    // Use a small delay to ensure the page is ready
    const timer = setTimeout(() => {
      // Make sure the page is visible
      ionPage.classList.remove('ion-page-hidden');
      ionPage.classList.remove('ion-page-invisible');
      ionPage.style.zIndex = '1';
      ionPage.style.visibility = 'visible';
    }, 20);

    cleanup = () => {
      if (!ionPage) return;
      clearTimeout(timer);
      ionPage.classList.add('ion-page-invisible');
      ionPage.style.visibility = 'hidden';
      ionPage.style.zIndex = '0';
    };
  });

  onBeforeUnmount(() => {
    if (cleanup) {
      cleanup();
    }
  });
} 