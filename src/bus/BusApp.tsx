import React from 'react';
import Routes from "./Routes.tsx";
import Directions from "./Directions.tsx";
import Stops from "./Stops.tsx";
import Buses from "./Buses.tsx";

function BusApp() {
    const [routeId, setRouteId] = React.useState<string | null>(null);

    const [direction, setDirection] = React.useState<string | null>(null);

    const [stopId, setStopId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlRouteId = searchParams.get('routeId');

        const localStorageRouteId = localStorage.getItem('routeId');

        const initialRouteId = urlRouteId ?? localStorageRouteId;

        if (initialRouteId) {
            setRouteId(initialRouteId);
        }

        const urlDirection = searchParams.get('direction');

        const localStorageDirection = localStorage.getItem('direction');

        const initialDirection = urlDirection ?? localStorageDirection;

        if (initialDirection) {
            setDirection(initialDirection);
        }

        const urlStopId = searchParams.get('stopId');

        const localStorageStopId = localStorage.getItem('stopId');

        const initialStopId = urlStopId ?? localStorageStopId;

        if (initialStopId) {
            setStopId(initialStopId);
        }
    }, []);

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
