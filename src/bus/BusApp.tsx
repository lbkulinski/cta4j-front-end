import React from 'react';
import '../App.css';
import Routes from "./Routes.tsx";
import Directions from "./Directions.tsx";
import Stops from "./Stops.tsx";
import Buses from "./Buses.tsx";

function BusApp() {
    const [routeId, setRouteId] = React.useState<string | null>(null);

    const [direction, setDirection] = React.useState<string | null>(null);

    const [stopId, setStopId] = React.useState<number | null>(null);

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
