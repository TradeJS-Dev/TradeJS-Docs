import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';
const t = (en: string, ru: string) => (currentLocale === 'ru' ? ru : en);

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: t('Introduction', 'Введение'),
      collapsed: false,
      items: [
        'intro',
        'introduction/what-is-tradejs',
        'introduction/who-is-it-for',
        'introduction/what-tradejs-is-not',
      ],
    },
    {
      type: 'category',
      label: t('Getting Started', 'Быстрый старт'),
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
        'getting-started/first-backtest',
        'getting-started/backtest-config',
        'getting-started/understanding-output',
        'getting-started/root-user',
        'getting-started/data-sync',
      ],
    },
    {
      type: 'category',
      label: t('Core Concepts', 'Базовые понятия'),
      collapsed: false,
      items: [
        'core-concepts/strategy',
        'core-concepts/market-data',
        'core-concepts/signals',
        'core-concepts/orders-positions',
        'core-concepts/metrics',
        'core-concepts/connectors',
        'core-concepts/plugins',
      ],
    },
    {
      type: 'category',
      label: t('Guides', 'Руководства'),
      items: [
        'examples',
        'guides/create-simple-strategy',
        'guides/backtest-strategy',
        'guides/data-quality',
        'guides/add-indicators',
        'guides/compare-strategies',
        'guides/pine-workflows',
        'guides/ai-ml-workflows',
        {
          type: 'category',
          label: t('Strategy Authoring Deep Dives', 'Подробно о стратегиях'),
          items: [
            'strategies/authoring/write-strategies',
            {
              type: 'category',
              label: t('Strategy Runtime Hooks', 'Хуки runtime-стратегий'),
              items: [
                'strategies/authoring/strategy-hooks/index',
                'strategies/authoring/strategy-hooks/on-init',
                'strategies/authoring/strategy-hooks/on-bar',
                'strategies/authoring/strategy-hooks/after-core-decision',
                'strategies/authoring/strategy-hooks/after-bar-decision',
                'strategies/authoring/strategy-hooks/on-skip',
                'strategies/authoring/strategy-hooks/before-close-position',
                'strategies/authoring/strategy-hooks/after-enrich-ml',
                'strategies/authoring/strategy-hooks/after-enrich-ai',
                'strategies/authoring/strategy-hooks/before-entry-gate',
                'strategies/authoring/strategy-hooks/before-place-order',
                'strategies/authoring/strategy-hooks/after-place-order',
                'strategies/authoring/strategy-hooks/on-runtime-error',
              ],
            },
            'strategies/authoring/typescript-strategy-step-by-step',
            'strategies/authoring/pine-strategy-step-by-step',
            'strategies/authoring/plugin-e2e',
          ],
        },
        {
          type: 'category',
          label: t('Built-In Strategies', 'Встроенные стратегии'),
          items: [
            'strategies/reference/trendline',
            'strategies/reference/reverse-trendline',
            'strategies/reference/breakout',
            'strategies/reference/ma-strategy',
            'strategies/reference/volume-divergence',
            'strategies/reference/adaptive-momentum-ribbon',
            'strategies/reference/adaptive-trend-channel',
            'strategies/reference/double-tap',
            'strategies/reference/liquidity-tails',
            'strategies/reference/liquidity-zones',
            'strategies/reference/structure-zones',
            'strategies/reference/trend-follow',
            'strategies/reference/trend-shift',
          ],
        },
        {
          type: 'category',
          label: t('Indicators', 'Индикаторы'),
          items: ['indicators/authoring', 'indicators/catalog'],
        },
      ],
    },
    {
      type: 'category',
      label: t('Advanced', 'Продвинутые темы'),
      items: [
        'advanced/architecture',
        'advanced/runtime',
        'advanced/diagrams',
        'advanced/manifests',
        'advanced/infra-docker',
        'advanced/extending-tradejs',
        'api/framework',
        'api/cli',
        {
          type: 'category',
          label: t('Backtesting', 'Бэктестинг'),
          items: [
            'runtime/backtesting/overview',
            'runtime/backtesting/grid-config',
            'runtime/backtesting/results-runtime-config',
            'runtime/backtesting/runtime-parity',
            'runtime/backtesting/strategy-playbook',
          ],
        },
        {
          type: 'category',
          label: t('Runtime Execution', 'Runtime-исполнение'),
          items: [
            'runtime/execution/signals',
            'runtime/execution/multi-strategy-signals',
            'runtime/execution/telegram-notifications',
          ],
        },
        {
          type: 'category',
          label: 'ML',
          items: [
            'ai-ml/ml/configuration',
            'ai-ml/ml/inspect',
            'ai-ml/ml/train-latest-select',
            'ai-ml/ml/infer-service',
            'ai-ml/ml/feature-engineering-cookbook',
            'ai-ml/ml/model-promotion-policy',
          ],
        },
        {
          type: 'category',
          label: 'AI',
          items: [
            'ai-ml/ai/configuration',
            'ai-ml/ai/prompt-replay',
            'ai-ml/ai/prompt-governance',
          ],
        },
        {
          type: 'category',
          label: t('Validation and Live Ops', 'Валидация и live-режим'),
          items: [
            'strategies/operations/risk-management',
            'strategies/operations/pre-live-checklist',
            'strategies/operations/debug-live',
          ],
        },
        {
          type: 'category',
          label: t('Operations', 'Эксплуатация'),
          items: [
            'operations/env-reference',
            'operations/redis-data-model',
            'operations/timescale-schema',
            'operations/add-exchange-connector',
            'operations/derivatives-ingest',
            'operations/maintenance-cli-scripts',
            'operations/production-runbook',
            'operations/monitoring-alerts',
            'operations/backup-restore',
            'operations/cloud-blueprint',
            'operations/security-hardening',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: t('Limitations', 'Ограничения'),
      items: [
        'limitations/index',
        'limitations/backtesting-caveats',
      ],
    },
  ],
};

export default sidebars;
