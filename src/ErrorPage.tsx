import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorPage() {
    const error = useRouteError();

    const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

    const title = is404 ? "404" : "Oops!";
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
