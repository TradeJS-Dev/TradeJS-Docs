"""Exercise the real static-server config on an isolated local Docker port."""
import http.client
import json
from pathlib import Path
import re
import subprocess
import tempfile
import time
import uuid

root = Path(__file__).resolve().parents[1]
name = 'docs-nginx-test-' + uuid.uuid4().hex
with tempfile.TemporaryDirectory(prefix='docs-nginx-') as directory:
    files = Path(directory)
    # Linux nginx workers need traversal permission on the fixture mount.
    files.chmod(0o755)
    for path, body in {'index.html': 'home', 'guide.html': 'guide', '404.html': 'missing',
                       'ru/index.html': 'ru home', 'ru/guide.html': 'ru guide', 'ru/404.html': 'missing'}.items():
        file = files / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(body)
    try:
        subprocess.run(['docker', 'run', '-d', '--name', name, '-p', '127.0.0.1::80',
                        '-v', str(root / 'nginx.docs.conf') + ':/etc/nginx/conf.d/default.conf:ro',
                        '-v', directory + ':/usr/share/nginx/html:ro', 'nginx:stable-alpine'], check=True)
        port = json.loads(subprocess.check_output(['docker', 'inspect', name]))[0]['NetworkSettings']['Ports']['80/tcp'][0]['HostPort']

        def get(path):
            connection = http.client.HTTPConnection('127.0.0.1', int(port), timeout=5)
            try:
                connection.request('GET', path, headers={'Host': 'untrusted.example'})
                response = connection.getresponse()
                return response.status, response.getheader('Location'), response.read().decode()
            finally:
                connection.close()

        for attempt in range(30):
            try:
                if get('/health')[0] == 200:
                    break
            except OSError:
                pass
            time.sleep(0.2)
        else:
            raise RuntimeError('Nginx did not become ready')
        for path, body in [('/', 'home'), ('/ru/', 'ru home'), ('/guide', 'guide'),
                           ('/guide/?q=value', 'guide'), ('/ru/guide/', 'ru guide')]:
            status, location, actual = get(path)
            assert (status, location, actual) == (200, None, body), (path, status, location)
        for path in ['/%5c%5cexternal.example/', '/%2f%2fexternal.example/',
                     '/%0d%0aLocation%3a%20https%3a%2f%2fexternal.example/', '/missing/']:
            status, location, _ = get(path)
            assert status in (400, 404) and location is None, (path, status, location)
        for prefix in ['', '/ru']:
            status, location, _ = get(prefix + '/guides/create-simple-strategy/?q=value')
            assert status == 301 and location == prefix + '/strategies/authoring/typescript-strategy-step-by-step?q=value', location

        config = (root / 'nginx.docs.conf').read_text()
        strategy_map = config.split('map $retired_strategy $has_marketplace_page {', 1)[1].split('}', 1)[0]
        slugs = re.findall(r'^\s+([a-z0-9-]+) 1;$', strategy_map, re.M)
        assert {'head-and-shoulders', 'reverse-trendline', 'trend-pullback'} <= set(slugs)
        marketplace = 'https://tradejs.dev/marketplace'
        for prefix in ['', '/ru']:
            legacy = prefix + '/strategies/reference'
            for suffix in ['', '/', '.html', '/index.html']:
                assert get(legacy + suffix + '?utm_source=docs')[:2] == (301, marketplace + '?utm_source=docs')
            for slug in slugs:
                for suffix in ['', '/', '.html']:
                    assert get(f'{legacy}/{slug}{suffix}')[:2] == (301, f'{marketplace}/{slug}')
            for path in [f'{legacy}/unknown-strategy/', f'{legacy}/%5c%5cexternal.example/']:
                status, location, _ = get(path)
                assert status in (400, 404) and location is None, (path, status, location)
        print('Nginx: normal pages, both locales, legacy Marketplace redirects and unsafe paths passed.')
    finally:
        subprocess.run(['docker', 'rm', '-f', name], stdout=subprocess.DEVNULL, check=False)
