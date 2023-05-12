import React from 'react';
import './App.css';
import {
    Stack
} from "@mui/material";
import Trains from "./Trains";
import Stations from "./Stations";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
                <Stack spacing={2}>
                    <Stations stationId={stationId} setStationId={setStationId} />
                    <Trains stationId={stationId}/>
                </Stack>
            </div>
        </ThemeProvider>
    );
}

export default App;
