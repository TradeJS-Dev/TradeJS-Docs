import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAlternatePageUtils } from '@docusaurus/theme-common/internal';

const copy = {
  en: {
    description: 'One strategy lifecycle from research to runtime.',
    app: 'Application',
    docs: 'Documentation',
    licensing: 'Licensing',
    github: 'GitHub Repository',
    contact: 'Contact me',
    switchLanguage: 'Switch language to Russian',
    links: 'TradeJS links',
    rights: 'All rights reserved.',
  },
  ru: {
    description: 'Единый цикл стратегии от исследования до runtime.',
    app: 'Приложение',
    docs: 'Документация',
    licensing: 'Лицензирование',
    github: 'GitHub-репозиторий',
    contact: 'Связаться',
    switchLanguage: 'Переключить язык на английский',
    links: 'Ссылки TradeJS',
    rights: 'Все права защищены.',
  },
};

const githubIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const xIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer(): React.ReactElement {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const { createUrl } = useAlternatePageUtils();
  const isRussian = currentLocale === 'ru';
  const t = copy[isRussian ? 'ru' : 'en'];
  const alternateLocale = isRussian ? 'en' : 'ru';
  const alternateUrl = createUrl({ locale: alternateLocale, fullyQualified: false });

  return (
    <footer className="tradejs-footer">
      <div className="tradejs-footer__container">
        <div className="tradejs-footer__main">
          <div className="tradejs-footer__brand">
            <div className="tradejs-footer__wordmark">
              <span className="tradejs-footer__mark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 17L9 11L13 15L21 7" />
                  <path d="M17 7H21V11" />
                </svg>
              </span>
              <strong>Trade<span>JS</span></strong>
            </div>
            <p>{t.description}</p>
          </div>

          <nav className="tradejs-footer__links" aria-label={t.links}>
            <Link href="https://app.tradejs.dev">{t.app}</Link>
            <Link to="/">{t.docs}</Link>
            <Link href="https://tradejs.dev/marketplace" target="_self">Marketplace</Link>
            <Link to="/introduction/licensing">{t.licensing}</Link>
            <Link href="https://github.com/tradejs-dev/tradejs">{githubIcon}{t.github}</Link>
            <Link href="https://x.com/tradejsdev">{xIcon}X</Link>
            <Link href="https://t.me/aleksnick">{t.contact}</Link>
            <a
              className="tradejs-footer__locale"
              href={alternateUrl}
              hrefLang={alternateLocale}
              aria-label={t.switchLanguage}
            >
              <span data-current={!isRussian}>EN</span>
              <span aria-hidden="true">/</span>
              <span data-current={isRussian}>RU</span>
            </a>
          </nav>
        </div>

        <p className="tradejs-footer__copyright">
          © {new Date().getFullYear()} TradeJS. {t.rights}
        </p>
      </div>
    </footer>
  );
}
