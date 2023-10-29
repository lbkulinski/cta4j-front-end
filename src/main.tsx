import './logrocketSetup';
import React from 'react'
import ReactDOM from 'react-dom/client'
import TrainApp from './train/TrainApp.tsx'
import './index.css'
import {ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MenuBar from "./MenuBar.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ErrorBoundary, Provider} from "@rollbar/react";
import BusApp from "./bus/BusApp.tsx";
import {RetryLink} from "@apollo/client/link/retry";
import HolidayTrainApp from "./holiday-train/HolidayTrainApp.tsx";

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const httpLink = new HttpLink({
    uri: `${import.meta.env.VITE_BACK_END_URL}/graphql`
});

const retryLink = new RetryLink();

const client = new ApolloClient({
    uri: `${import.meta.env.VITE_BACK_END_URL}/graphql`,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getTrains: {
                        merge(_, incoming){
                            return incoming;
                        }
                    }
                }
            }
        }
    }),
    link: ApolloLink.from([
        retryLink,
        httpLink
    ])
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
    },
    {
        path: "/holiday-train",
        element: <HolidayTrainApp />
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider config={rollbarConfig}>
            <ErrorBoundary>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <ApolloProvider client={client}>
                        <MenuBar />
                        <RouterProvider router={router} />
                    </ApolloProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>,
);
