import React from 'react';
import './App.css';
import Trains from "./Trains";
import Stations from "./Stations";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuBar from "./MenuBar.tsx";

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
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div>
                <MenuBar title="Trains" />
                <Stations stationId={stationId} setStationId={setStationId} />
                <Trains stationId={stationId}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
