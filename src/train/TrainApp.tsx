import React from 'react';
import Trains from "./Trains.tsx";
import Stations from "./Stations.tsx";

function TrainApp() {
    const [stationId, setStationId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const prevTitle = document.title;
        document.title = 'cta4j — CTA Train Tracker';
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const prevCanonical = canonical?.getAttribute('href') ?? '';
        canonical?.setAttribute('href', 'https://cta4j.com/');
        return () => {
            document.title = prevTitle;
            canonical?.setAttribute('href', prevCanonical);
        };
    }, []);

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
