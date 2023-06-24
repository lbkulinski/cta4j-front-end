import {useQuery} from "@apollo/client";
import {Autocomplete, TextField} from "@mui/material";
import {gql} from "../__generated__";
import {useRollbar} from "@rollbar/react";

interface StopsProps {
    routeId: string | null,
    direction: string | null,
    stopId: string | null,
    setStopId: (stopId: string | null) => void
}

const GET_STOPS = gql(`
query GetRouteStops($id: ID!, $direction: String!) {
    getRouteStops(id: $id, direction: $direction) {
        id
        name
        latitude
        longitude
    }
}
`);

interface Option {
    id: string;
    label: string;
}

function Stops(props: StopsProps) {
    const routeId = props.routeId;

    const direction = props.direction;

    const queryOptions = {
        skip: (routeId === null) || (direction === null),
        variables: {
            id: routeId!,
            direction: direction!
        }
    }

    const {loading, error, data} = useQuery(GET_STOPS,
        queryOptions);

    const rollbar = useRollbar();

    if (loading) {
        return null;
    }

    if (error) {
        const errorData = {
            error: error,
            data: data
        }

        const errorDataString = JSON.stringify(errorData);

        rollbar.error("An error occurred when trying to fetch the stops", errorDataString);
    }

    if (!data) {
        return null;
    }

    const stops = data.getRouteStops;

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    stops.forEach(stop => {
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

                localStorage.setItem("stopId", value.id);

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Stops;
