import React from 'react';
import '../App.css';
import Routes from "./Routes.tsx";
import Directions from "./Directions.tsx";
import Stops from "./Stops.tsx";
import Buses from "./Buses.tsx";

function BusApp() {
    const searchParams = new URLSearchParams(window.location.search);

    let defaultRouteId = searchParams.get("routeId");

    if (defaultRouteId === null) {
        defaultRouteId = localStorage.getItem("routeId");
    }

    let defaultDirection = searchParams.get("direction");

    if (defaultDirection === null) {
        defaultDirection = localStorage.getItem("direction");
    }

    let defaultStopId = searchParams.get("stopId");

    if (defaultStopId === null) {
        defaultStopId = localStorage.getItem("stopId");
    }

    const [routeId, setRouteId] = React.useState<string | null>(defaultRouteId);

    const [direction, setDirection] = React.useState<string | null>(defaultDirection);

    const [stopId, setStopId] = React.useState<string | null>(defaultStopId);

    return (
        <div>
            <Routes routeId={routeId} setRouteId={setRouteId} />
            <Directions routeId={routeId} direction={direction} setDirection={setDirection} />
            <Stops routeId={routeId} direction={direction} stopId={stopId} setStopId={setStopId} />
            <Buses routeId={routeId} stopId={stopId} />
        </div>
    );
}

export default BusApp;
