const auditUrls = [
  'http://localhost:3001/',
  'http://localhost:3001/getting-started/quickstart',
  'http://localhost:3001/strategies/authoring/pine-strategy-step-by-step',
  'http://localhost:3001/strategies/authoring/pine-strategy-runtime-setup',
  'http://localhost:3001/strategies/authoring/pine-strategy-runtime-decisions',
  'http://localhost:3001/ru/getting-started/quickstart',
];

module.exports = {
  ci: {
    collect: {
      // Audit the same extensionless URLs used by production. On a raw
      // .html path, the client router replaces a valid article with the 404 page.
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Serving',
      url: auditUrls,
      numberOfRuns: 5,
      settings: {
        blockedUrlPatterns: [
          '*://mc.yandex.ru/*',
          '*://mc.yandex.com/*',
        ],
      },
    },
    assert: {
      assertions: {
        'categories:performance': [
          'error',
          { minScore: 0.95, aggregationMethod: 'median' },
        ],
        'categories:accessibility': [
          'error',
          { minScore: 0.95, aggregationMethod: 'median' },
        ],
        'categories:seo': [
          'error',
          { minScore: 1, aggregationMethod: 'median' },
        ],
        'largest-contentful-paint': [
          'error',
          // LHCI's compressed local server is HTTP/1.1. Production is held to
          // 2.5 s after the HTTP/2 deploy; keep a small protocol allowance here.
          { maxNumericValue: 2800, aggregationMethod: 'median' },
        ],
        'total-blocking-time': [
          'error',
          { maxNumericValue: 200, aggregationMethod: 'median' },
        ],
        'cumulative-layout-shift': [
          'error',
          { maxNumericValue: 0.1, aggregationMethod: 'median' },
        ],
        'resource-summary:script:size': [
          'warn',
          { maxNumericValue: 204_800, aggregationMethod: 'median' },
        ],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci-reports',
    },
  },
};
