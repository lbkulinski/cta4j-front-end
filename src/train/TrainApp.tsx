import React from 'react';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";
import useDocumentMetadata from "../useDocumentMetadata.ts";

function TrainApp() {
    useDocumentMetadata('cta4j — Train Tracker', 'https://cta4j.com/');
    const [stationId, setStationId] = React.useState<string | null>(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStationId = searchParams.get('stationId');

        const localStorageStationId = localStorage.getItem('stationId');

        return urlStationId ?? localStorageStationId;
    });

    return (
        <div>
            <Stations stationId={stationId} setStationId={setStationId} />
            <Trains stationId={stationId} />
        </div>
    );
}

export default TrainApp;
