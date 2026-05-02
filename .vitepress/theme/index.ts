import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick, h, defineComponent } from 'vue';
import { useRoute } from 'vitepress';
import SchemePicker from './SchemePickerRaw.vue';
import HeroCarousel from './HeroCarousel.vue';
import SchemeImage from './SchemeImage.vue';
import FlatImage from './FlatImage.vue';
import './custom.css';

const CraftLayout = defineComponent({
  setup() {
    const route = useRoute();
    let zoomInstance: ReturnType<typeof mediumZoom> | null = null;

    const initZoom = () => {
      if (zoomInstance) {
        zoomInstance.detach();
      }
      // Attach zoom to screenshots and the hero carousel — NOT badges,
      // stat cards, or tech-stack chips (those live under .craft-showcase
      // but aren't meaningful to zoom into).
      zoomInstance = mediumZoom('.vp-doc img, .feature-screenshot img, .scheme-screenshot, .flat-screenshot, .hero-carousel img', {
        background: 'rgba(0, 0, 0, 0.85)',
      });
    };

    onMounted(() => {
      // Delay to let SchemeImage v-if="mounted" render their <img> elements
      setTimeout(initZoom, 500);
      const saved = localStorage.getItem('craft-docs-scheme');
      if (saved && saved !== 'xanderu') {
        const root = document.documentElement;
        root.className = root.className.replace(/\bscheme-\w+\b/g, '').trim();
        root.classList.add(`scheme-${saved}`);
      }

      // Re-attach zoom when scheme changes (SchemeImage swaps <img> elements)
      const observer = new MutationObserver(() => {
        setTimeout(initZoom, 300);
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });
    watch(() => route.path, () => nextTick(() => setTimeout(initZoom, 500)));

    return () => h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroCarousel),
      'layout-bottom': () => h(SchemePicker),
    });
  },
});

export default {
  extends: DefaultTheme,
  Layout: CraftLayout,
  enhanceApp({ app }) {
    app.component('SchemeImage', SchemeImage);
    app.component('FlatImage', FlatImage);
  },
};
