import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { strategies } from './strategies';

export default function StrategyCatalog() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale === 'ru' ? 'ru' : 'en';
  const imageRoot = useBaseUrl('/img/');

  return (
    <ul className="strategy-catalog">
      {strategies.map((strategy) => {
        const { name, slug } = strategy;
        const preview =
          slug === 'head-and-shoulders'
            ? 'head-and-shoulders-signal.webp'
            : `strategy-previews/${slug}.webp`;
        return (
          <li key={slug}>
            <Link
              to={`/strategies/reference/${slug}`}
              className="strategy-catalog__card"
            >
              <div className="strategy-catalog__preview">
                <img
                  src={imageRoot + preview}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="strategy-catalog__content">
                <strong>
                  {name} <span aria-hidden="true">→</span>
                </strong>
                <span>{strategy[locale]}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
