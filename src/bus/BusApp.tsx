import React from 'react';
import '../App.css';
import Routes from "./Routes.tsx";
import Directions from "./Directions.tsx";

function BusApp() {
    /*
    const searchParams = new URLSearchParams(window.location.search);

    let defaultStationId = searchParams.get("stationId");

    if (defaultStationId === null) {
        defaultStationId = localStorage.getItem("stationId");
    }

    const [stationId, setStationId] = React.useState<string | null>(defaultStationId);
     */
    const [routeId, setRouteId] = React.useState<string | null>(null);

    const [direction, setDirection] = React.useState<string | null>(null);

    return (
        <div>
            <Routes routeId={routeId} setRouteId={setRouteId} />
            <Directions routeId={routeId} direction={direction} setDirection={setDirection} />
        </div>
    );
}

export default BusApp;