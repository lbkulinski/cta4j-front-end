import React from 'react';
import './App.css';
import {
    Stack
} from "@mui/material";
import Trains from "./Trains";
import Stations from "./Stations";

function App() {
    const searchParams = new URLSearchParams(window.location.search);

    const stationIdString = searchParams.get("stationId");

    const defaultStationId = (stationIdString === null) ? null : parseInt(stationIdString);

    const [stationId, setStationId] = React.useState<number | null>(defaultStationId);

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
