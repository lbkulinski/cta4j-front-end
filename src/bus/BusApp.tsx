import React from 'react';
import Routes from "./Routes.tsx";
import Directions from "./Directions.tsx";
import Stops from "./Stops.tsx";
import Buses from "./Buses.tsx";
import useDocumentMetadata from "../useDocumentMetadata.ts";

function BusApp() {
    useDocumentMetadata('cta4j — Bus Tracker', 'https://cta4j.com/buses');
    const [routeId, setRouteId] = React.useState<string | null>(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlRouteId = searchParams.get('routeId');

        const localStorageRouteId = localStorage.getItem('routeId');

        return urlRouteId ?? localStorageRouteId;
    });

    const [direction, setDirection] = React.useState<string | null>(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlDirection = searchParams.get('direction');

        const localStorageDirection = localStorage.getItem('direction');

        return urlDirection ?? localStorageDirection;
    });

    const [stopId, setStopId] = React.useState<string | null>(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStopId = searchParams.get('stopId');

        const localStorageStopId = localStorage.getItem('stopId');

        return urlStopId ?? localStorageStopId;
    });

    return (
        <div>
            <Routes
                routeId={routeId}
                setRouteId={setRouteId}
                setDirection={setDirection}
                setStopId={setStopId}
            />
            <Directions
                routeId={routeId}
                direction={direction}
                setDirection={setDirection}
                setStopId={setStopId}
            />
            <Stops
                routeId={routeId}
                direction={direction}
                stopId={stopId}
                setStopId={setStopId}
            />
            <Buses routeId={routeId} stopId={stopId} />
        </div>
    );
}

export default BusApp;
