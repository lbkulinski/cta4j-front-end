import React from 'react';

export default function useDocumentMetadata(title: string, canonicalHref: string) {
    React.useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const hadHref = canonical?.hasAttribute('href') ?? false;
        const prevCanonical = hadHref ? canonical!.getAttribute('href')! : null;
        canonical?.setAttribute('href', canonicalHref);
        return () => {
            document.title = prevTitle;
            if (!canonical) return;
            if (hadHref && prevCanonical !== null) {
                canonical.setAttribute('href', prevCanonical);
            } else {
                canonical.removeAttribute('href');
            }
        };
    }, [title, canonicalHref]);
}
