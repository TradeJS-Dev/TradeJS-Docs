import React, { useEffect, useRef } from 'react';
import type { Props } from '@theme/Root';
import { useLocation } from '@docusaurus/router';

const YANDEX_METRIKA_ID = 107255958;
const YANDEX_METRIKA_SRC = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
const YANDEX_METRIKA_FALLBACK_DELAY_MS = 8000;
const YANDEX_METRIKA_IDLE_TIMEOUT_MS = 2000;
const YANDEX_METRIKA_INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'touchstart',
] as const;

type YmFn = {
  (...args: unknown[]): void;
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YmFn;
    __tradejsYmInit?: boolean;
  }
}

function ensureYandexMetrikaInit(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (window.__tradejsYmInit) {
    return;
  }

  const ym = (window.ym ??
    ((...args: unknown[]) => {
      const queue = window.ym?.a ?? [];
      queue.push(args);
      if (window.ym) {
        window.ym.a = queue;
      }
    })) as YmFn;

  window.ym = ym;
  window.ym.l = Date.now();

  const alreadyLoaded = Array.from(document.scripts).some(
    (script) => script.src === YANDEX_METRIKA_SRC,
  );

  if (!alreadyLoaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = YANDEX_METRIKA_SRC;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  window.ym(YANDEX_METRIKA_ID, 'init', {
    ssr: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });

  window.__tradejsYmInit = true;
}

function scheduleYandexMetrikaInit(): () => void {
  let disposed = false;
  let pageLoaded = document.readyState === 'complete';
  let interactionObserved = false;
  let fallbackTimeoutId: number | undefined;
  let idleCallbackId: number | undefined;

  const removeInteractionListeners = () => {
    for (const eventName of YANDEX_METRIKA_INTERACTION_EVENTS) {
      window.removeEventListener(eventName, handleInteraction, true);
    }
  };

  const initializeWhenIdle = () => {
    if (disposed || window.__tradejsYmInit) {
      return;
    }

    removeInteractionListeners();
    if (fallbackTimeoutId !== undefined) {
      window.clearTimeout(fallbackTimeoutId);
      fallbackTimeoutId = undefined;
    }

    if (typeof window.requestIdleCallback === 'function') {
      idleCallbackId = window.requestIdleCallback(ensureYandexMetrikaInit, {
        timeout: YANDEX_METRIKA_IDLE_TIMEOUT_MS,
      });
    } else {
      fallbackTimeoutId = globalThis.window.setTimeout(
        ensureYandexMetrikaInit,
        0,
      );
    }
  };

  const scheduleFallback = () => {
    fallbackTimeoutId = window.setTimeout(
      initializeWhenIdle,
      YANDEX_METRIKA_FALLBACK_DELAY_MS,
    );
  };

  function handleInteraction(): void {
    interactionObserved = true;
    if (pageLoaded) {
      initializeWhenIdle();
    }
  }

  function handleLoad(): void {
    pageLoaded = true;
    if (interactionObserved) {
      initializeWhenIdle();
    } else {
      scheduleFallback();
    }
  }

  for (const eventName of YANDEX_METRIKA_INTERACTION_EVENTS) {
    window.addEventListener(eventName, handleInteraction, {
      capture: true,
      passive: true,
    });
  }

  if (pageLoaded) {
    scheduleFallback();
  } else {
    window.addEventListener('load', handleLoad, { once: true });
  }

  return () => {
    disposed = true;
    window.removeEventListener('load', handleLoad);
    removeInteractionListeners();
    if (fallbackTimeoutId !== undefined) {
      window.clearTimeout(fallbackTimeoutId);
    }
    if (
      idleCallbackId !== undefined &&
      typeof window.cancelIdleCallback === 'function'
    ) {
      window.cancelIdleCallback(idleCallbackId);
    }
  };
}

export default function Root({ children }: Props): React.ReactElement {
  const location = useLocation();
  const lastTrackedHrefRef = useRef<string | null>(null);
  const docsJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'TradeJS Docs',
        url: 'https://docs.tradejs.dev',
        inLanguage: ['en-US', 'ru-RU'],
        about: 'Technical documentation for the TradeJS TypeScript framework',
      },
      {
        '@type': 'CollectionPage',
        name: 'TradeJS Documentation',
        url: `https://docs.tradejs.dev${location.pathname}${location.search}${location.hash}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'TradeJS Docs',
          url: 'https://docs.tradejs.dev',
        },
        description:
          'Official docs for the TradeJS TypeScript framework: setup, APIs, strategy authoring, indicators, runtime execution, backtesting, AI/ML, and operations.',
      },
    ],
  };

  useEffect(() => {
    return scheduleYandexMetrikaInit();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const currentHref = window.location.href;

    if (lastTrackedHrefRef.current == null) {
      lastTrackedHrefRef.current = currentHref;
      return;
    }

    if (lastTrackedHrefRef.current === currentHref) {
      return;
    }

    if (typeof window.ym === 'function') {
      window.ym(YANDEX_METRIKA_ID, 'hit', currentHref, {
        referrer: document.referrer,
      });
    }

    lastTrackedHrefRef.current = currentHref;
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(docsJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {children}
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
