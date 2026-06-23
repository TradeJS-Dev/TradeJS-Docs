import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';
const t = (en: string, ru: string) => (currentLocale === 'ru' ? ru : en);

const config: Config = {
  title: 'TradeJS Docs',
  tagline: 'Technical docs for the TradeJS open-source framework',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.tradejs.dev',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      ru: {
        label: 'Русский',
        htmlLang: 'ru-RU',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        docsRouteBasePath: '/',
        hashed: true,
        indexBlog: false,
        indexDocs: true,
        indexPages: false,
        language: ['en', 'ru'],
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'description',
        content:
          'Official documentation for the TradeJS open-source framework: strategy authoring, indicators, runtime, backtesting, AI/ML, and operations.',
      },
      {
        name: 'keywords',
        content:
          'TradeJS, trading docs, algorithmic trading, TypeScript strategies, Pine Script, backtesting, AI/ML',
      },
      {
        name: 'robots',
        content: 'index,follow,max-image-preview:large,max-snippet:-1',
      },
      {
        name: 'author',
        content: 'TradeJS Team',
      },
    ],
    image: 'img/docusaurus-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'TradeJS Docs',
      logo: {
        alt: 'TradeJS',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started/quickstart',
          position: 'left',
          label: t('Getting started', 'Начало'),
        },
        {
          type: 'doc',
          docId: 'core-concepts/strategy',
          position: 'left',
          label: t('Concepts', 'Понятия'),
        },
        {
          type: 'doc',
          docId: 'examples',
          position: 'left',
          label: t('Examples', 'Примеры'),
        },
        {
          type: 'doc',
          docId: 'guides/backtest-strategy',
          position: 'left',
          label: t('Backtesting', 'Бэктестинг'),
        },
        {
          type: 'doc',
          docId: 'advanced/runtime',
          position: 'left',
          label: t('Runtime', 'Рантайм'),
        },
        {
          type: 'doc',
          docId: 'limitations/index',
          position: 'left',
          label: t('Limitations', 'Ограничения'),
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://x.com/tradejsdev',
          label: 'X.com',
          position: 'right',
          'aria-label': 'TradeJS X account',
        },
        {
          href: 'https://github.com/tradejs-dev/tradejs',
          label: 'GitHub',
          position: 'right',
          'aria-label': 'TradeJS GitHub repository',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'TradeJS Docs',
        src: 'img/tradejs-docs-wordmark.svg',
        href: '/',
        width: 300,
        height: 56,
      },
      links: [
        {
          title: t('Getting Started', 'Начало'),
          items: [
            { label: t('Overview', 'Обзор'), to: '/' },
            { label: t('Installation', 'Установка'), to: '/getting-started/installation' },
            { label: t('Quickstart', 'Быстрый старт'), to: '/getting-started/quickstart' },
            { label: t('First Backtest', 'Первый бэктест'), to: '/getting-started/first-backtest' },
            { label: t('Root User Setup', 'Настройка пользователя root'), to: '/getting-started/root-user' },
          ],
        },
        {
          title: t('Guides', 'Руководства'),
          items: [
            { label: t('Examples', 'Примеры'), to: '/examples' },
            { label: t('Core API', 'Базовый API'), to: '/api/framework' },
            {
              label: t('Creating Strategies', 'Создание стратегий'),
              to: '/guides/create-simple-strategy',
            },
            { label: t('Backtest a Strategy', 'Бэктест стратегии'), to: '/guides/backtest-strategy' },
          ],
        },
        {
          title: t('Advanced', 'Продвинутые темы'),
          items: [
            { label: t('Architecture', 'Архитектура'), to: '/advanced/architecture' },
            { label: t('CLI API', 'CLI API'), to: '/api/cli' },
            {
              label: t('Production Runbook', 'Руководство по эксплуатации продакшена'),
              to: '/operations/production-runbook',
            },
            { label: t('Backtesting Caveats', 'Ограничения бэктестинга'), to: '/limitations/backtesting-caveats' },
          ],
        },
        {
          title: t('Open Source', 'Open Source'),
          items: [
            {
              label: t('GitHub Repository', 'Репозиторий GitHub'),
              href: 'https://github.com/tradejs-dev/tradejs',
            },
            {
              label: t('Issue Tracker', 'Трекер задач'),
              href: 'https://github.com/tradejs-dev/tradejs/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TradeJS`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
