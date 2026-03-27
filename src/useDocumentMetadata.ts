import React from 'react';

export default function useDocumentMetadata(title: string, canonicalHref: string) {
    React.useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const prevCanonical = canonical?.getAttribute('href') ?? '';
        canonical?.setAttribute('href', canonicalHref);
        return () => {
            document.title = prevTitle;
            canonical?.setAttribute('href', prevCanonical);
        };
    }, [title, canonicalHref]);
}
