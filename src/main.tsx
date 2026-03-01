import React from 'react'
import ReactDOM from 'react-dom/client'
import TrainApp from './train/TrainApp.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MenuBar from "./MenuBar.tsx";
import Footer from "./Footer.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ErrorBoundary, Provider} from "@rollbar/react";
import BusApp from "./bus/BusApp.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AxiosError, isAxiosError} from "axios";
import HolidayApp from "./holiday-train/HolidayApp.tsx";
import ErrorPage from "./ErrorPage.tsx";

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT
};

const darkTheme = createTheme({
    typography: {
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    palette: {
        mode: "dark",
        primary: {
            main: '#c60c30',
        },
        background: {
            default: '#0a0a0a',
            paper: '#0d0d0d',
        },
        text: {
            primary: '#e5e5e5',
            secondary: '#aaaaaa',
        },
        divider: '#2a2a2a',
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <TrainApp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/trains",
        element: <TrainApp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/buses",
        element: <BusApp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/holiday-train",
        element: <HolidayApp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (isAxiosError(error)) {
                    const status = (error as AxiosError)?.response?.status;

                    if (status === 404) {
                        return false;
                    }
                }

                return failureCount < 2;
            },
            retryDelay: () => 500
        },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider config={rollbarConfig}>
            <ErrorBoundary>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <MenuBar />
                        <Box sx={{ flex: 1, maxWidth: '56rem', width: '100%', mx: 'auto', px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 3 } }}>
                            <QueryClientProvider client={queryClient}>
                                <RouterProvider router={router} />
                            </QueryClientProvider>
                        </Box>
                        <Footer />
                    </Box>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>,
);
