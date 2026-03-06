import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function RouterErrorPage() {
    const error = useRouteError();
    return <ErrorPage error={error} />;
}

export default function ErrorPage({ error }: { error?: unknown } = {}) {
    const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

    const title = is404 ? "404" : "Oops!";

    React.useEffect(() => {
        const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        const prevRobots = meta?.getAttribute('content') ?? '';
        meta?.setAttribute('content', 'noindex, follow');

        const prevTitle = document.title;
        document.title = is404
            ? 'cta4j — 404 Not Found'
            : isRouteErrorResponse(error)
                ? `cta4j — ${error.status} ${error.statusText}`
                : 'cta4j — Error';

        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const prevCanonical = canonical?.getAttribute('href') ?? '';
        canonical?.removeAttribute('href');

        return () => {
            meta?.setAttribute('content', prevRobots);
            document.title = prevTitle;
            if (prevCanonical) canonical?.setAttribute('href', prevCanonical);
        };
    }, [error, is404]);
    const message = is404
        ? "Page not found."
        : isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : "An unexpected error occurred.";

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex={1}
            textAlign="center"
            gap={2}
        >
            <Typography variant="h4" component="h1">
                {title}
            </Typography>
            <Typography variant="body1">
                {message}
            </Typography>
            <Typography variant="body2">
                <a href="/" style={{ color: '#c60c30' }}>Go home</a>
            </Typography>
        </Box>
    );
}
