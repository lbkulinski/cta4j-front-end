import {Alert, Autocomplete, TextField} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {useGetStops} from "../api/generated.ts";

interface StopsProps {
    routeId: string | null,
    direction: string | null,
    stopId: number | null,
    setStopId: (stopId: number | null) => void
}

interface Option {
    id: number;
    label: string;
}

function Stops(props: StopsProps) {
    const routeId = props.routeId;

    const direction = props.direction;

    const queryOptions = {
        query: {
            enabled: (routeId != null) && (direction != null)
        }
    };

    const {data, isLoading, error} = useGetStops(routeId, direction, queryOptions);

    const rollbar = useRollbar();

    if (isLoading) {
        return null;
    } else if (error) {
        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the stop data. Please check back later.
            </Alert>
        );
    } else if (!data || data.length === 0) {
        return (
            <Alert severity="warning">
                There are no stops to choose from. Please check back later.
            </Alert>
        );
    }

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    data.forEach(stop => {
        const id = stop.id;

        const name = stop.name;

        if ((id === props.stopId)) {
            defaultOption = {
                id: id,
                label: name
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: id,
            label: name
        });
    });

    options.sort((option0, option1) => option0.label.localeCompare(option1.label));

    return (
        <Autocomplete
            sx={{p: 2, maxWidth: 500}}
            size={"small"}
            renderInput={(params) => <TextField {...params} label="Stop"/>}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    return;
                }

                props.setStopId(value.id);

                localStorage.setItem("stopId", String(value.id));

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Stops;
