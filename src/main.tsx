import './logrocketSetup';
import React from 'react'
import ReactDOM from 'react-dom/client'
import TrainApp from './train/TrainApp.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MenuBar from "./MenuBar.tsx";
import CssBaseline from "@mui/material/CssBaseline";
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
    palette: {
        mode: "dark",
    },
});

const router = createBrowserRouter([
    {
        path: "*",
        element: <TrainApp />,
        errorElement: <ErrorPage />,
    },
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
        path: "/holiday",
        element: <HolidayApp />,
        errorElement: <ErrorPage />,
    }
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
                    <MenuBar />
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                    </QueryClientProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>,
);
