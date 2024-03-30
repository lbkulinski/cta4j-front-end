import './logrocketSetup';
import React from 'react'
import ReactDOM from 'react-dom/client'
import TrainApp from './train/TrainApp.tsx'
import './index.css'
import {ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split} from '@apollo/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MenuBar from "./MenuBar.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ErrorBoundary, Provider} from "@rollbar/react";
import BusApp from "./bus/BusApp.tsx";
import HolidayApp from "./holiday-train/HolidayApp.tsx";
import {createClient} from "graphql-ws";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {getMainDefinition} from "@apollo/client/utilities";
import {RetryLink} from "@apollo/client/link/retry";
import {onError} from "@apollo/client/link/error";
import Rollbar from "rollbar";

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const retryLink = new RetryLink();

const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(error => {
            if (error.extensions.errorType === "NOT_FOUND") {
                return;
            }

            const rollbar = new Rollbar(rollbarConfig);

            rollbar.error(`[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`);
        });

        return forward(operation);
    }

    if (networkError) {
        const rollbar = new Rollbar(rollbarConfig);

        rollbar.error(`[Network error]: ${networkError}`);
    }
});

const httpLink = new HttpLink({
    uri: `https://${import.meta.env.VITE_BACK_END_URL}/graphql`
});

const wsLink = new GraphQLWsLink(createClient({
    url: `wss://${import.meta.env.VITE_BACK_END_URL}/subscriptions`,
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);

        return (definition.kind === 'OperationDefinition') && (definition.operation === 'subscription');
    },
    wsLink,
    ApolloLink.from([
        retryLink,
        errorLink,
        httpLink
    ]),
);

const client = new ApolloClient({
    uri: `${import.meta.env.VITE_BACK_END_URL}/graphql`,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    buses: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    routeDirections: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    routes: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    routeStops: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    bus: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    train: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    stations: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    trains: {
                        merge(_, incoming){
                            return incoming;
                        }
                    }
                }
            },
            Subscription: {
                fields: {
                    busesSubscribe: {
                        merge(_, incoming){
                            return incoming;
                        }
                    },
                    trainsSubscribe: {
                        merge(_, incoming){
                            return incoming;
                        }
                    }
                }
            }
        }
    }),
    link: splitLink
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
        element: <HolidayApp />
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
