import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AI Vendor Evaluation Framework',
  tagline: 'Systematic evaluation framework for Fortune 500 AI procurement decisions',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://vendor.feedforward.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'adamjdavidson',
  projectName: 'vendoreval4',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false, // Disable blog for this project
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AI Vendor Evaluation',
      logo: {
        alt: 'AI Vendor Evaluation Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'frameworkSidebar',
          position: 'left',
          label: 'Framework',
        },
        // Vendor Examples will be added when vendor documentation is created
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'vendorsSidebar',
        //   position: 'left',
        //   label: 'Vendor Examples',
        // },
        {
          href: 'https://vendor.feedforward.ai/evaluate',
          label: 'Start Evaluation',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Framework',
          items: [
            {
              label: 'Overview',
              to: '/docs/framework',
            },
            {
              label: 'Six Criteria',
              to: '/docs/framework/see',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Maturity Model',
              to: '/docs/maturity-model/overview',
            },
            {
              label: 'Start Evaluation',
              href: 'https://vendor.feedforward.ai/evaluate',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Vendor Evaluation Framework. Built for Fortune 500 executives.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
