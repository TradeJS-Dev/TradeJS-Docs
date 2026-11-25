import { themes as prismThemes, type PrismTheme } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';
const t = (en: string, ru: string) => (currentLocale === 'ru' ? ru : en);

const tradejsPrism = (theme: PrismTheme, overrides: PrismTheme['styles'] = []): PrismTheme => ({
  plain: { color: 'var(--tradejs-ink)', backgroundColor: 'var(--tradejs-subtle)' },
  styles: [
    ...theme.styles,
    { types: ['comment', 'prolog', 'cdata'], style: { color: 'var(--tradejs-muted)' } },
    { types: ['string', 'char', 'builtin', 'regex', 'attr-value'], style: { color: 'var(--tradejs-code)' } },
    ...overrides,
  ],
});

const config: Config = {
  title: 'TradeJS Docs',
  tagline: 'Self-hosted TypeScript trading strategy framework',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.tradejs.dev',
  baseUrl: '/',
  trailingSlash: false,

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
        sitemap: {
          lastmod: 'date',
          changefreq: null,
          priority: null,
          createSitemapItems: async ({ defaultCreateSitemapItems, ...params }) => {
            const items = await defaultCreateSitemapItems(params);
            const buildDate = new Date().toISOString().slice(0, 10);

            return items
              .filter(({ url }) => {
                const pathname = new URL(url).pathname.replace(/\/+$/, '');
                return !pathname.endsWith('/search');
              })
              .map((item) => ({
                ...item,
                lastmod: item.lastmod ?? buildDate,
              }));
          },
        },
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
          'Documentation for the TradeJS TypeScript framework: build, backtest, and run programmable trading strategies with a self-hosted runtime.',
      },
      {
        name: 'keywords',
        content:
          'TradeJS, TypeScript trading strategies, self-hosted trading framework, algorithmic trading, backtesting, runtime',
      },
      {
        name: 'author',
        content: 'TradeJS Team',
      },
    ],
    image: 'img/docusaurus-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'TradeJS Docs',
      logo: {
        alt: 'TradeJS',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          href: 'https://tradejs.dev/marketplace',
          position: 'left',
          label: 'Marketplace',
        },
        {
          to: '/getting-started/first-backtest',
          activeBaseRegex: '^/(?:ru/)?(?:getting-started|runtime/backtesting)(?:/|$)',
          position: 'left',
          label: t('First backtest', 'Первый бэктест'),
        },
        {
          to: '/strategies/authoring/typescript-strategy-step-by-step',
          activeBaseRegex: '^/(?:ru/)?(?:strategies/authoring|indicators|api/framework)(?:/|$)',
          position: 'left',
          label: t('Developers', 'Разработчикам'),
        },
        {
          to: '/guides/develop-with-an-agent',
          activeBaseRegex: '^/(?:ru/)?guides/(?:develop-with-an-agent|codex-strategy-skills)(?:/|$)',
          position: 'left',
          label: t('Agents', 'Агенты'),
        },
        {
          to: '/guides/mcp',
          exact: true,
          position: 'left',
          label: 'MCP',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: tradejsPrism(prismThemes.oneLight, [
        { types: ['punctuation'], style: { color: 'var(--tradejs-ink)' } },
        { types: ['attr-name', 'class-name', 'boolean', 'constant', 'number', 'atrule'], style: { color: '#754b16' } },
        { types: ['property', 'tag', 'symbol', 'deleted', 'important'], style: { color: '#a03648' } },
        { types: ['variable', 'operator', 'function', 'url'], style: { color: '#245780' } },
      ]),
      darkTheme: tradejsPrism(prismThemes.oneDark),
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
