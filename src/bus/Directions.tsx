import {Alert, Autocomplete, TextField} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {useEffect, useState} from "react";
import {Configuration, RoutesApi} from "../client";

interface DirectionsProps {
    routeId: string | null,
    direction: string | null,
    setDirection: (direction: string | null) => void,
    setStopId: (stopId: number | null) => void
}

interface Option {
    id: string;
    label: string;
}

function Directions(props: DirectionsProps) {
    const routeId = props.routeId;

    const [directions, setDirections] = useState<string[] | null>(null);

    const [error, setError] = useState<Error | null>(null);

    const rollbar = useRollbar();

    useEffect(() => {
        if (routeId === null) {
            setDirections(null);

            return;
        }
        
        const apiConfiguration = new Configuration({
            basePath: import.meta.env.VITE_BACK_END_URL
        });

        const routesApi = new RoutesApi(apiConfiguration);

        routesApi.getDirections({routeId: routeId})
                 .then(response => {
                     setDirections(response);
                 })
                 .catch(e => {
                     rollbar.error(e);

                     setError(e);
                 });
    }, [rollbar, routeId]);

    if (directions === null) {
        return null;
    } else if (error) {
        return (
            <Alert severity="error">
                An error occurred while retrieving the direction data. Please check back later.
            </Alert>
        );
    }

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    directions.forEach(direction => {
        if ((direction === props.direction)) {
            defaultOption = {
                id: direction,
                label: direction
            };
        }

        if (names.has(direction)) {
            return;
        }

        names.add(direction);

        options.push({
            id: direction,
            label: direction
        });
    });

    options.sort((option0, option1) => option0.label.localeCompare(option1.label));

    return (
        <Autocomplete
            sx={{p: 2, maxWidth: 500}}
            size={"small"}
            renderInput={(params) => <TextField {...params} label="Direction"/>}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    return;
                }

                props.setDirection(value.id);

                props.setStopId(null);

                localStorage.setItem("direction", value.id);

                localStorage.removeItem("stopId");

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Directions;
