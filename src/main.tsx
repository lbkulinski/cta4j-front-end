import './logrocketSetup';
import React from 'react'
import ReactDOM from 'react-dom/client'
import TrainApp from './train/TrainApp.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuBar from "./MenuBar.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ErrorBoundary, Provider} from "@rollbar/react";
import BusApp from "./bus/BusApp.tsx";

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

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
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider config={rollbarConfig}>
            <ErrorBoundary>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <ApolloProvider client={client}>
                        <BrowserRouter>
                            <MenuBar />
                            <Routes>
                                <Route path="/" element={<TrainApp />} />
                                <Route path="/trains" element={<TrainApp />} />
                                <Route path="/buses" element={<BusApp />} />
                            </Routes>
                        </BrowserRouter>
                    </ApolloProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>,
);
