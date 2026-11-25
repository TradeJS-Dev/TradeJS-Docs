import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';
const t = (en: string, ru: string) => (currentLocale === 'ru' ? ru : en);

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: t('Introduction', 'Введение'),
      items: [
        'intro',
        'introduction/what-is-tradejs',
        'introduction/trading-workflow-and-terms',
        'introduction/who-is-it-for',
        'introduction/what-tradejs-is-not',
        'introduction/licensing',
      ],
    },
    {
      type: 'category',
      label: t('Getting Started', 'Быстрый старт'),
      items: [
        'getting-started/first-backtest',
        'guides/develop-with-an-agent',
        'getting-started/add-strategy',
        'getting-started/installation',
        'getting-started/backtest-config',
        'getting-started/understanding-output',
      ],
    },
    'guides/mcp',
    {
      type: 'category',
      label: t('Core Concepts', 'Базовые понятия'),
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
        'guides/data-quality',
        'guides/compare-strategies',
        'guides/ai-ml-workflows',
        {
          type: 'category',
          label: t('Write a strategy', 'Написать свою стратегию'),
          items: [
            'strategies/authoring/write-strategies',
            {
              type: 'category',
              label: t('Strategy hooks', 'События при работе стратегии'),
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
            {
              type: 'category',
              label: t(
                'Pine Strategy Step by Step',
                'Pine-стратегия пошагово',
              ),
              link: {
                type: 'doc',
                id: 'strategies/authoring/pine-strategy-step-by-step',
              },
              items: [
                'strategies/authoring/pine-strategy-pine-and-config',
                'strategies/authoring/pine-strategy-figures',
                {
                  type: 'category',
                  label: t('Pine Runtime Bridge', 'Связь с Pine'),
                  link: {
                    type: 'doc',
                    id: 'strategies/authoring/pine-strategy-runtime-bridge',
                  },
                  items: [
                    'strategies/authoring/pine-strategy-runtime-setup',
                    'strategies/authoring/pine-strategy-runtime-decisions',
                  ],
                },
                'strategies/authoring/pine-strategy-registration-and-backtest',
              ],
            },
            'strategies/authoring/plugin-e2e',
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
      label: t('Research and Validation', 'Исследование и проверка'),
      items: [
        'runtime/backtesting/overview',
        'runtime/backtesting/grid-config',
        'runtime/backtesting/results-runtime-config',
        'runtime/backtesting/replay-evidence',
        'runtime/backtesting/runtime-parity',
        'runtime/backtesting/strategy-playbook',
        'guides/codex-strategy-skills',
      ],
    },
    {
      type: 'category',
      label: t('Live Trading', 'Реальная торговля'),
      items: [
        'getting-started/run-strategy-in-production',
        'runtime/execution/signals',
        'runtime/execution/multi-strategy-signals',
        'runtime/execution/telegram-notifications',
        'strategies/operations/risk-management',
        'strategies/operations/pre-live-checklist',
        'strategies/operations/debug-live',
      ],
    },
    {
      type: 'category',
      label: t('Reference and Operations', 'Справочник и эксплуатация'),
      items: [
        'advanced/architecture',
        'advanced/repository-ownership',
        'advanced/runtime',
        'advanced/diagrams',
        'advanced/manifests',
        'advanced/infra-docker',
        'advanced/extending-tradejs',
        'api/framework',
        'api/cli',
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
          label: t('Operations', 'Эксплуатация'),
          items: [
            'operations/env-reference',
            'operations/redis-data-model',
            'operations/timescale-schema',
            'operations/add-exchange-connector',
            'getting-started/root-user',
            'getting-started/data-sync',
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
