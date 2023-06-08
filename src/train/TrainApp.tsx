import React from 'react';
import '../App.css';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";

function TrainApp() {
    const searchParams = new URLSearchParams(window.location.search);

    let defaultStationId = searchParams.get("stationId");

    if (defaultStationId === null) {
        defaultStationId = localStorage.getItem("stationId");
    }

    const [stationId, setStationId] = React.useState<string | null>(defaultStationId);

    return (
        <div>
            <Stations stationId={stationId} setStationId={setStationId} />
            <Trains stationId={stationId} />
        </div>
    );
}

export default TrainApp;
