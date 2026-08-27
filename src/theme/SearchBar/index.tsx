import React, {
  type ComponentType,
  type FocusEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type SearchBarProps = {
  handleSearchBarToggle?: (active: boolean) => void;
};

type SearchBarModule = {
  default: ComponentType<SearchBarProps>;
};

let searchBarModulePromise: Promise<SearchBarModule> | undefined;

function loadSearchBar(): Promise<SearchBarModule> {
  searchBarModulePromise ??= import('@theme-original/SearchBar');
  return searchBarModulePromise;
}

export default function SearchBar(props: SearchBarProps): React.ReactElement {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const [SearchBarComponent, setSearchBarComponent] =
    useState<ComponentType<SearchBarProps> | null>(null);
  const placeholderRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<Element | null>(null);
  const shouldFocusRef = useRef(false);

  const activate = useCallback(() => {
    shouldFocusRef.current = true;
    navbarRef.current = placeholderRef.current?.closest('.navbar') ?? null;
    void loadSearchBar().then(({ default: LoadedSearchBar }) => {
      setSearchBarComponent(() => LoadedSearchBar);
    });
  }, []);

  useEffect(() => {
    if (!SearchBarComponent || !shouldFocusRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const input = navbarRef.current?.querySelector<HTMLInputElement>(
        '.navbar__search-input',
      );
      input?.focus();
      shouldFocusRef.current = false;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [SearchBarComponent]);

  useEffect(() => {
    if (SearchBarComponent) {
      return;
    }

    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey
      ) {
        event.preventDefault();
        activate();
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [SearchBarComponent, activate]);

  if (SearchBarComponent) {
    return <SearchBarComponent {...props} />;
  }

  const label = currentLocale === 'ru' ? 'Поиск' : 'Search';

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.blur();
    activate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };

  return (
    <div className="navbar__search" dir="ltr">
      <input
        ref={placeholderRef}
        className="navbar__search-input"
        type="search"
        readOnly
        aria-label={label}
        placeholder={label}
        onFocus={handleFocus}
        onClick={activate}
        onKeyDown={handleKeyDown}
        onPointerEnter={() => void loadSearchBar()}
      />
    </div>
  );
}
