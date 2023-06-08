import {useQuery} from "@apollo/client";
import {Alert, Autocomplete, TextField} from "@mui/material";
import {gql} from "../__generated__";
import {useRollbar} from "@rollbar/react";

interface RoutesProps {
    routeId: string | null,
    setRouteId: (routeId: string | null) => void
}

const GET_ROUTES = gql(`
query GetRoutes {
    getRoutes {
        id
        name
    }
}
`);

interface Option {
    id: string;
    label: string;
}

function Routes(props: RoutesProps) {
    const {loading, error, data} = useQuery(GET_ROUTES);

    if (loading) {
        return null;
    }

    if (error) {
        const rollbar = useRollbar();

        const errorData = {
            error: error,
            data: data
        }

        const errorDataString = JSON.stringify(errorData);

        rollbar.error("An error occurred when trying to fetch the routes", errorDataString);

        return (
            <Alert severity="error">
                Error: The routes could not be loaded. Please refresh the page or try again later.
            </Alert>
        );
    }

    if (!data) {
        return null;
    }

    const routes = data.getRoutes;

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    routes.forEach(route => {
        const id = route.id;

        const name = route.name;

        if ((id === props.routeId)) {
            defaultOption = {
                id: id,
                label: name
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        const label = `${name} (${route.id})`;

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

                localStorage.setItem("routeId", value.id);

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Routes;
