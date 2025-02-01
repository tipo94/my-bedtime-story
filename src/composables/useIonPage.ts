import { onMounted, onBeforeUnmount } from 'vue';

export function useIonPage() {
  const setupPage = () => {
    // Find all ion-page elements
    const pages = document.querySelectorAll('ion-page');
    pages.forEach(page => {
      // Remove any existing classes
      page.classList.remove('ion-page-hidden');
      page.classList.remove('ion-page-invisible');
      // Add the base class
      page.classList.add('ion-page');
    });
  };

  onMounted(() => {
    setupPage();
    // Add a small delay to ensure the page is ready
    setTimeout(setupPage, 100);
  });

  onBeforeUnmount(() => {
    const pages = document.querySelectorAll('ion-page');
    pages.forEach(page => {
      page.classList.add('ion-page-invisible');
    });
  });
} 