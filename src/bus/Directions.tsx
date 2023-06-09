import {useQuery} from "@apollo/client";
import {Autocomplete, TextField} from "@mui/material";
import {gql} from "../__generated__";
import {useRollbar} from "@rollbar/react";

interface DirectionsProps {
    routeId: string | null,
    direction: string | null,
    setDirection: (direction: string | null) => void
}

const GET_DIRECTIONS = gql(`
query GetRouteDirections($id: ID!) {
    getRouteDirections(id: $id) {
        name
    }
}
`);

interface Option {
    id: string;
    label: string;
}

function Directions(props: DirectionsProps) {
    const routeId = props.routeId;

    const queryOptions = {
        skip: routeId === null,
        variables: {
            id: routeId!
        }
    }

    const {loading, error, data} = useQuery(GET_DIRECTIONS,
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

        rollbar.error("An error occurred when trying to fetch the directions", errorDataString);
    }

    if (!data) {
        return null;
    }

    const directions = data.getRouteDirections;

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    directions.forEach(direction => {
        const name = direction.name;

        if ((name === props.direction)) {
            defaultOption = {
                id: name,
                label: name
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: name,
            label: name
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

                localStorage.setItem("direction", value.id);

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Directions;
