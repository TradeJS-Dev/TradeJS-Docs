const auditUrls = [
  'http://localhost/',
  'http://localhost/getting-started/quickstart.html',
  'http://localhost/strategies/authoring/pine-strategy-step-by-step.html',
  'http://localhost/strategies/authoring/pine-strategy-runtime-setup.html',
  'http://localhost/strategies/authoring/pine-strategy-runtime-decisions.html',
  'http://localhost/ru/getting-started/quickstart.html',
];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './build',
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
