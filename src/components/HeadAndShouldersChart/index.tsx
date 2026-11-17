import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const copy = {
  ru: {
    signal: 'Пример пробоя линии шеи',
    signalDetails:
      'Средняя вершина выше двух соседних. После правого плеча свеча закрывается ниже линии шеи.',
    shoulder: 'Плечо',
    head: 'Голова',
    neckline: 'Линия шеи',
    breakdown: 'Пробой вниз',
  },
  en: {
    signal: 'Example neckline break',
    signalDetails:
      'The middle peak is higher than the two shoulders. After the right shoulder, a candle closes below the neckline.',
    shoulder: 'Shoulder',
    head: 'Head',
    neckline: 'Neckline',
    breakdown: 'Break below',
  },
};

export default function HeadAndShouldersChart() {
  const { i18n } = useDocusaurusContext();
  const signalChart = useBaseUrl('/img/head-and-shoulders-signal.webp');
  const t = i18n.currentLocale === 'ru' ? copy.ru : copy.en;
  return (
    <figure className="strategy-example__figure">
      <figcaption>{t.signal}</figcaption>
      <div className="strategy-example__plot">
        <img
          src={signalChart}
          alt={t.signalDetails}
          width="1200"
          height="620"
        />
        <div className="strategy-example__annotations" aria-hidden="true">
          <span>{t.shoulder}</span>
          <span>{t.head}</span>
          <span>{t.shoulder}</span>
          <span>{t.breakdown}</span>
        </div>
      </div>
      <div className="strategy-example__legend">
        <span>{t.neckline}</span>
      </div>
    </figure>
  );
}
