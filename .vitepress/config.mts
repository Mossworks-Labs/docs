import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'CRAFT Studio',
  description: 'Content Refinement & Authoring Framework Toolkit — User Guide',
  base: '/',
  ignoreDeadLinks: [/localhost/],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Marketplace', link: '/guide/marketplace' },
      { text: 'Open Studio', link: 'https://dev.mossworks.io/studio/', target: '_blank' },
      { text: 'Open Marketplace', link: 'https://marketplace.mossworks.io/', target: '_blank' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'AI Providers', link: '/guide/ai-providers' },
          { text: 'Buyer & Seller', link: '/guide/auth' },
        ],
      },
      {
        text: 'Studio basics',
        items: [
          { text: 'Sidebar & ⌘K', link: '/guide/command-palette' },
          { text: 'Channels', link: '/guide/channels' },
          { text: 'Settings', link: '/guide/settings' },
        ],
      },
      {
        text: 'Make content',
        items: [
          { text: 'Episodes', link: '/guide/episodes' },
          { text: 'Proposals', link: '/guide/proposals' },
          { text: 'Discover', link: '/guide/discover' },
          { text: 'Scripts', link: '/guide/scripts' },
          { text: 'Storyboard', link: '/guide/storyboard' },
          { text: 'Audio (TTS)', link: '/guide/audio' },
          { text: 'Resources', link: '/guide/resources' },
        ],
      },
      {
        text: 'Marketplace',
        items: [
          { text: 'Overview', link: '/guide/marketplace' },
          { text: 'Hiring a creator', link: '/guide/marketplace-buyer' },
          { text: 'Selling your work', link: '/guide/marketplace-seller' },
          { text: 'Beta testing reference', link: '/guide/beta-testing' },
        ],
      },
      {
        text: 'Marketplace reference',
        collapsed: true,
        items: [
          { text: 'Browse', link: '/guide/marketplace-browse' },
          { text: 'Gigs', link: '/guide/marketplace-gigs' },
          { text: 'Brand partners', link: '/guide/marketplace-brand-partners' },
          { text: 'Artist profile', link: '/guide/marketplace-artist-profile' },
          { text: 'My Studio', link: '/guide/marketplace-my-studio' },
          { text: 'Gamification', link: '/guide/marketplace-gamification' },
          { text: 'Seller onboarding', link: '/guide/marketplace-onboarding' },
          { text: 'Hire & contract', link: '/guide/marketplace-hire' },
        ],
      },
      {
        text: 'Extras',
        items: [
          { text: 'Feedback', link: '/guide/feedback' },
        ],
      },
      {
        text: 'Infrastructure',
        items: [
          { text: 'AI Agents', link: '/guide/agents' },
          { text: 'Jobs & Workers', link: '/guide/jobs' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mossworks-Labs/docs' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Built by <a href="https://github.com/Mossworks-Labs" target="_blank">Mossworks Labs</a>',
    },
  },
  appearance: 'dark',
});
