import React from 'react';
import './App.css';
import Trains from "./Trains";
import Stations from "./Stations";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuBar from "./MenuBar.tsx";
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const searchParams = new URLSearchParams(window.location.search);

    let defaultStationId = searchParams.get("stationId");

    if (defaultStationId === null) {
        defaultStationId = localStorage.getItem("stationId");
    }

    const [stationId, setStationId] = React.useState<string | null>(defaultStationId);

    return (
        <Provider config={rollbarConfig}>
            <ErrorBoundary>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div>
                        <MenuBar title="Trains" />
                        <Stations stationId={stationId} setStationId={setStationId} />
                        <Trains stationId={stationId}/>
                    </div>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    );
}

export default App;
