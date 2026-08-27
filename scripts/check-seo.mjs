import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildRoot = path.join(repositoryRoot, 'build');
const siteOrigin = 'https://docs.tradejs.dev';

const locales = [
  {
    name: 'en',
    buildDirectory: buildRoot,
    sitemapPath: path.join(buildRoot, 'sitemap.xml'),
    selfHreflang: 'en-US',
  },
  {
    name: 'ru',
    buildDirectory: path.join(buildRoot, 'ru'),
    sitemapPath: path.join(buildRoot, 'ru', 'sitemap.xml'),
    selfHreflang: 'ru-RU',
  },
];

const flagshipPaths = new Set([
  '/',
  '/getting-started/installation',
  '/getting-started/quickstart',
  '/getting-started/first-backtest',
  '/guides/backtest-strategy',
  '/strategies/authoring/typescript-strategy-step-by-step',
  '/strategies/authoring/pine-strategy-step-by-step',
  '/indicators/authoring',
  '/runtime/backtesting/overview',
  '/operations/cloud-blueprint',
  '/operations/production-runbook',
]);

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing required file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => ({
    raw: match[0],
    attributes: parseAttributes(match[0]),
  }));
}

function sitemapItems(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const block = match[1];
    return {
      loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
      lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    };
  });
}

function htmlPathForUrl(url) {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  if (!pathname) {
    return path.join(buildRoot, 'index.html');
  }

  const htmlFile = path.join(buildRoot, `${pathname}.html`);
  return fs.existsSync(htmlFile) ? htmlFile : path.join(buildRoot, pathname, 'index.html');
}

function localeRelativePath(pathname, locale) {
  if (locale === 'ru') {
    return pathname.replace(/^\/ru(?=\/|$)/, '') || '/';
  }
  return pathname;
}

const robots = read(path.join(repositoryRoot, 'static', 'robots.txt'));
assert(robots.includes('Sitemap: https://docs.tradejs.dev/sitemap.xml'), 'robots.txt must list EN sitemap');
assert(
  robots.includes('Sitemap: https://docs.tradejs.dev/ru/sitemap.xml'),
  'robots.txt must list RU sitemap',
);

const nginx = read(path.join(repositoryRoot, 'nginx.docs.conf'));
assert(nginx.includes('absolute_redirect off;'), 'Nginx redirects must remain scheme-relative');
assert(!nginx.includes('try_files $uri $uri/ /index.html;'), 'Unknown routes must not fall back to index.html');
assert(nginx.includes('try_files $uri $uri.html $uri/ =404;'), 'Unknown routes must return 404');
assert(fs.existsSync(path.join(buildRoot, '404.html')), 'English 404 page is missing');
assert(fs.existsSync(path.join(buildRoot, 'ru', '404.html')), 'Russian 404 page is missing');

let checkedUrls = 0;

for (const locale of locales) {
  const items = sitemapItems(read(locale.sitemapPath));
  const seenTitles = new Map();
  const seenDescriptions = new Map();

  assert(items.length > 0, `${locale.name} sitemap is empty`);

  for (const item of items) {
    assert(item.loc, `${locale.name} sitemap contains an item without loc`);
    assert(item.loc.startsWith(`${siteOrigin}/`), `Unexpected sitemap origin: ${item.loc}`);

    const url = new URL(item.loc);
    const pathname = url.pathname;
    const relativePath = localeRelativePath(pathname, locale.name);

    const isLocaleRoot = pathname === '/' || pathname === '/ru/';
    assert(isLocaleRoot || !pathname.endsWith('/'), `Sitemap URL must not have a trailing slash: ${item.loc}`);
    assert(!relativePath.replace(/\/+$/, '').endsWith('/search'), `Search page leaked into sitemap: ${item.loc}`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(item.lastmod ?? ''), `Missing or invalid lastmod: ${item.loc}`);

    const html = read(htmlPathForUrl(item.loc));
    const linkTags = tags(html, 'link');
    const metaTags = tags(html, 'meta');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const canonical = linkTags.find((tag) => tag.attributes.rel === 'canonical')?.attributes.href;
    const selfAlternate = linkTags.find(
      (tag) =>
        tag.attributes.rel === 'alternate' && tag.attributes.hreflang === locale.selfHreflang,
    )?.attributes.href;
    const description = metaTags.find((tag) => tag.attributes.name === 'description')?.attributes.content;
    const robotsMeta = metaTags.find((tag) => tag.attributes.name === 'robots')?.attributes.content;

    assert(canonical === item.loc, `Canonical mismatch for ${item.loc}: ${canonical}`);
    assert(selfAlternate === item.loc, `Self hreflang mismatch for ${item.loc}: ${selfAlternate}`);
    assert(title, `Missing title for ${item.loc}`);
    assert(title.length <= 70, `Title exceeds 70 characters for ${item.loc}: ${title}`);
    assert(description, `Missing description for ${item.loc}`);
    assert(!robotsMeta?.includes('noindex'), `Noindex URL leaked into sitemap: ${item.loc}`);

    if (flagshipPaths.has(relativePath)) {
      assert(description.length >= 100, `Flagship description is too short for ${item.loc}`);
    }

    assert(!seenTitles.has(title), `Duplicate ${locale.name} title: ${title}`);
    assert(!seenDescriptions.has(description), `Duplicate ${locale.name} description: ${description}`);
    seenTitles.set(title, item.loc);
    seenDescriptions.set(description, item.loc);
    checkedUrls += 1;
  }

  const searchUrl = `${siteOrigin}${locale.name === 'ru' ? '/ru' : ''}/search`;
  const searchHtml = read(htmlPathForUrl(searchUrl));
  const searchRobots = tags(searchHtml, 'meta')
    .filter((tag) => tag.attributes.name === 'robots')
    .map((tag) => tag.attributes.content ?? '');
  assert(
    searchRobots.some((content) => content.includes('noindex')),
    `${locale.name} search page must contain a valid robots noindex meta tag`,
  );
}

console.log(`SEO checks passed for ${checkedUrls} canonical sitemap URLs.`);
