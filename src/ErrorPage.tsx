import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorPage() {
    const error = useRouteError();

    let message = "An unexpected error occurred.";

    if (isRouteErrorResponse(error)) {
        message = `${error.status} ${error.statusText}`;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            gap={2}
        >
            <Typography variant="h4" component="h1">
                Oops!
            </Typography>
            <Typography variant="body1">
                {message}
            </Typography>
        </Box>
    );
}
