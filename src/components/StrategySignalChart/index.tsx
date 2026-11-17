import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { examples, type StrategyExample, type StrategySlug } from './examples';
import styles from './styles.module.css';

const priceAspectRatio = 2;

function PricePlot({
  example,
  showLabels = true,
}: {
  example: StrategyExample;
  showLabels?: boolean;
}) {
  const { closes, guides = [], zones = [], markers, wicks = {} } = example;
  const spacing = 90 / closes.length;
  const x = (bar: number) => 5 + (bar + 0.5) * spacing;
  const y = (value: number) => 88 - value * 0.75;

  return (
    <div className={styles.price} aria-hidden="true">
      {zones.map(({ bars: [first, last], prices: [low, high] }, index) => (
        <span
          key={index}
          className={styles.zone}
          style={{
            left: `${x(first) - spacing / 2}%`,
            width: `${spacing * (last - first + 1)}%`,
            top: `${y(high)}%`,
            height: `${y(low) - y(high)}%`,
          }}
        />
      ))}
      {guides.map(({ points, color = 'gold', solid }, index) =>
        points.slice(1).map(([bar, value], segment) => {
          const [startBar, startValue] = points[segment];
          const dx = x(bar) - x(startBar);
          const dy = (y(value) - y(startValue)) / priceAspectRatio;

          return (
            <span
              key={`${index}-${segment}`}
              className={styles.guide}
              data-color={color}
              data-solid={solid}
              style={{
                left: `${x(startBar)}%`,
                top: `${y(startValue)}%`,
                width: `${Math.hypot(dx, dy)}%`,
                transform: `rotate(${Math.atan2(dy, dx)}rad)`,
              }}
            />
          );
        }),
      )}
      {closes.map((close, bar) => {
        const previous = closes[bar - 1] ?? close - 5;
        const open = close + (previous - close) * 0.68 + ((bar % 3) - 1) * 2;
        const bodyHigh = Math.max(open, close);
        const bodyLow = Math.min(open, close);
        const [wickLow, wickHigh] = wicks[bar] ?? [
          bodyLow - 3 - (bar % 4),
          bodyHigh + 3 + (bar % 3),
        ];
        const low = Math.min(bodyLow, wickLow);
        const high = Math.max(bodyHigh, wickHigh);

        return (
          <span
            key={bar}
            className={styles.wick}
            data-down={close < open}
            style={{
              left: `${x(bar)}%`,
              top: `${y(high)}%`,
              height: `${y(low) - y(high)}%`,
            }}
          >
            <span
              className={styles.candle}
              style={{
                top: `${((high - bodyHigh) / (high - low)) * 100}%`,
                height: `${((bodyHigh - bodyLow) / (high - low)) * 100}%`,
              }}
            />
          </span>
        );
      })}
      {markers.map(({ bar }, index) => (
        <span
          key={bar}
          className={styles.marker}
          data-signal={index === 1}
          style={{ left: `${x(bar)}%` }}
        >
          {showLabels && <span className={styles.badge}>{index + 1}</span>}
        </span>
      ))}
    </div>
  );
}

export function StrategySignalPreview({
  strategy,
}: {
  strategy: StrategySlug;
}) {
  return <PricePlot example={examples[strategy]} showLabels={false} />;
}

export default function StrategySignalChart({
  strategy,
}: {
  strategy: StrategySlug;
}) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale === 'ru' ? 'ru' : 'en';
  const example: StrategyExample = examples[strategy];
  const { lower, markers } = example;

  return (
    <figure className={styles.figure} data-strategy-chart={strategy}>
      <PricePlot example={example} />
      {lower && (
        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>{lower[locale]}</div>
          <div
            className={styles.indicatorBars}
            style={{
              gridTemplateColumns: `repeat(${lower.values.length}, minmax(0, 1fr))`,
            }}
            aria-hidden="true"
          >
            {lower.values.map((value, bar) => (
              <span key={bar} style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>
      )}
      <figcaption className={styles.caption}>
        <span className={styles.note}>
          {locale === 'ru' ? 'Условные данные' : 'Illustrative data'}
        </span>
        <ol className={styles.steps}>
          {markers.map((marker, index) => (
            <li key={marker.bar} data-signal={index === 1}>
              {marker[locale]}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
