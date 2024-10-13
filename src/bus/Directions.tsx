import {Alert, Autocomplete, TextField} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {useGetDirections} from "../api/generated.ts";

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
    const routeId = props.routeId ?? "";

    const queryOptions = {
        query: {
            enabled: props.routeId != null
        }
    };

    const {data, isLoading, error} = useGetDirections(routeId, queryOptions);

    const rollbar = useRollbar();

    if (isLoading || !data) {
        return null;
    } else if (error) {
        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the direction data. Please check back later.
            </Alert>
        );
    } else if (data.length === 0) {
        return (
            <Alert severity="warning">
                There are no directions to choose from. Please check back later.
            </Alert>
        );
    }

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    data.forEach(direction => {
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
