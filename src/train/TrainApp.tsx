import React from 'react';
import '../App.css';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";

function TrainApp() {
    const [stationId, setStationId] = React.useState<number | null>(null);

    return (
        <div>
            <Stations stationId={stationId} setStationId={setStationId} />
            <Trains stationId={stationId} />
        </div>
    );
}

export default TrainApp;
