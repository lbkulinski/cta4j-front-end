import React from 'react';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";
import useDocumentMetadata from "../useDocumentMetadata.ts";

function TrainApp() {
    useDocumentMetadata('cta4j — CTA Train Tracker', 'https://cta4j.com/');

    const [stationId, setStationId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStationId = searchParams.get('stationId');

        const localStorageStationId = localStorage.getItem('stationId');

        const initialStationId = urlStationId ?? localStorageStationId;

        if (initialStationId) {
            setStationId(initialStationId);
        }
    }, []);

    return (
        <div>
            <Stations stationId={stationId} setStationId={setStationId} />
            <Trains stationId={stationId} />
        </div>
    );
}

export default TrainApp;
