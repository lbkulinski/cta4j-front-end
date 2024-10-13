import React from 'react';
import '../App.css';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";

function TrainApp() {
    const [stationId, setStationId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStationId = searchParams.get('stationId');

        const localStorageStationId = localStorage.getItem('stationId');

        const initialStationIdString = urlStationId ?? localStorageStationId;

        if (initialStationIdString) {
            const initialStationId = parseInt(initialStationIdString, 10);

            if (!isNaN(initialStationId)) {
                setStationId(initialStationId);
            }
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