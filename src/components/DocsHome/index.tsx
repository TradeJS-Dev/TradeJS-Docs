import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const copy = {
  ru: {
    title: 'Документация TradeJS',
    description:
      'Выбирайте готовые торговые стратегии, проверяйте их на исторических данных и пишите свои на TypeScript.',
    catalog: 'Готовые стратегии',
    catalogDescription:
      'Найдите стратегию и узнайте, как она торгует и как её подключить.',
    backtest: 'Первый бэктест',
    backtestDescription:
      'Установите TradeJS, запустите тест в приложении и разберите результат.',
    agents: 'Разработка с агентом',
    agentsDescription:
      'Дайте агенту документацию и начните с готового запроса для разработки или проверки стратегии.',
    mcp: 'Подключить MCP',
    mcpDescription: 'Дайте агенту доступ к сигналам, данным рынка и бэктестам в вашем TradeJS.',
  },
  en: {
    title: 'TradeJS documentation',
    description:
      'Choose a trading strategy, test it on historical data, or write your own in TypeScript.',
    catalog: 'Ready-to-use strategies',
    catalogDescription:
      'Find a strategy and see how it trades and how to install it.',
    backtest: 'First backtest',
    backtestDescription:
      'Install TradeJS, run a test in the app, and read the results.',
    agents: 'Develop with an agent',
    agentsDescription:
      'Give your agent the docs and start with a prompt for writing or testing a strategy.',
    mcp: 'Connect MCP',
    mcpDescription: 'Give your agent access to signals, market data, and backtests in your TradeJS app.',
  },
};

export default function DocsHome() {
  const { i18n } = useDocusaurusContext();
  const t = i18n.currentLocale === 'ru' ? copy.ru : copy.en;
  const links = [
    {
      to: '/strategies/reference',
      title: t.catalog,
      description: t.catalogDescription,
    },
    {
      to: '/getting-started/first-backtest',
      title: t.backtest,
      description: t.backtestDescription,
    },
    {
      to: '/guides/develop-with-an-agent',
      title: t.agents,
      description: t.agentsDescription,
    },
    {
      to: '/guides/mcp',
      title: t.mcp,
      description: t.mcpDescription,
    },
  ];

  return (
    <div className="docs-home">
      <h1>{t.title}</h1>
      <p>{t.description}</p>
      <ul className="docs-home__links">
        {links.map(({ to, title, description }) => (
          <li key={to}>
            <Link to={to}>{title}</Link>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
