import {Alert, Autocomplete, TextField} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {useGetStations} from "../api/generated.ts";

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
    const {data, isLoading, error} = useGetStations();

    const rollbar = useRollbar();

    if (isLoading) {
        return null;
    } else if (error) {
        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the station data. Please check back later.
            </Alert>
        );
    } else if (!data || (data.length === 0)) {
        return (
            <Alert severity="warning">
                There are no routes to choose from. Please check back later.
            </Alert>
        );
    }

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    data.forEach(route => {
        const id = route.id;

        const idString = id.toString();

        const name = route.name;

        const label = `${name} (${route.id})`;

        if ((idString === props.routeId)) {
            defaultOption = {
                id: idString,
                label: label
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: idString,
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
