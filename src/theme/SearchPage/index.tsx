import React from 'react';
import Head from '@docusaurus/Head';
import OriginalSearchPage from '@theme-original/SearchPage';

type SearchPageProps = React.ComponentProps<typeof OriginalSearchPage>;

export default function SearchPage(props: SearchPageProps): React.ReactElement {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <OriginalSearchPage {...props} />
    </>
  );
}
