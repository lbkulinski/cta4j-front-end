import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorPage() {
    const error = useRouteError();

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

        return () => {
            meta?.setAttribute('content', prevRobots);
            document.title = prevTitle;
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
                <Link to="/" style={{ color: '#c60c30' }}>Go home</Link>
            </Typography>
        </Box>
    );
}
