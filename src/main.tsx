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
import {AxiosError} from "axios";
import {isAxiosError} from "./api/axios-instance.ts";

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
        element: <TrainApp />
    },
    {
        path: "/",
        element: <TrainApp />
    },
    {
        path: "/trains",
        element: <TrainApp />
    },
    {
        path: "/buses",
        element: <BusApp />
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
