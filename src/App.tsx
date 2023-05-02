import React from 'react';
import './App.css';
import {
    Stack
} from "@mui/material";
import Trains from "./Trains";
import Stations from "./Stations";

function App() {
    const searchParams = new URLSearchParams(window.location.search);

    const defaultStationId = searchParams.get("stationId");

    const [stationId, setStationId] = React.useState<string | null>(defaultStationId);

    return (
        <div>
            <Stack spacing={2}>
                <Stations stationId={stationId} setStationId={setStationId} />
                <Trains stationId={stationId}/>
            </Stack>
        </div>
    );
}

export default App;
