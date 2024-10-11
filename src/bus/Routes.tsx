import {Alert, Autocomplete, TextField} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {useEffect, useState} from "react";
import {Configuration, Route, RoutesApi} from "../client";

interface RoutesProps {
    routeId: string | null,
    setRouteId: (routeId: string | null) => void,
    setDirection: (direction: string | null) => void,
    setStopId: (stopId: number | null) => void
}

interface Option {
    id: string;
    label: string;
}

function Routes(props: RoutesProps) {
    const [routes, setRoutes] = useState<Route[] | null>(null);

    const [error, setError] = useState<Error | null>(null);

    const rollbar = useRollbar();

    useEffect(() => {
        const apiConfiguration = new Configuration({
            basePath: import.meta.env.VITE_BACK_END_URL
        });

        const routesApi = new RoutesApi(apiConfiguration);

        routesApi.getRoutes()
                 .then(response => {
                     setRoutes(response);
                 })
                 .catch(e => {
                     rollbar.error(e);

                     setError(e);
                 });
    }, [rollbar]);

    if (routes === null) {
        return null;
    } else if (error) {
        return (
            <Alert severity="error">
                An error occurred while retrieving the station data. Please check back later.
            </Alert>
        );
    }

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    routes.forEach(route => {
        const id = route.id;

        const name = route.name;

        const label = `${name} (${route.id})`;

        if ((id === props.routeId)) {
            defaultOption = {
                id: id,
                label: label
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: route.id,
            label: label
        });
    });

    options.sort((option0, option1) => option0.label.localeCompare(option1.label));

    return (
        <Autocomplete
            sx={{p: 2, maxWidth: 500}}
            size={"small"}
            renderInput={(params) => <TextField {...params} label="Route"/>}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    return;
                }

                props.setRouteId(value.id);

                props.setDirection(null);

                props.setStopId(null);

                localStorage.setItem("routeId", value.id);

                localStorage.removeItem("direction");

                localStorage.removeItem("stopId");

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Routes;
