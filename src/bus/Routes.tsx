import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import { Route, useGetRoutes } from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface RoutesProps {
    routeId: string | null;
    setRouteId: (routeId: string | null) => void;
    setDirection: (direction: string | null) => void;
    setStopId: (stopId: string | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Routes(props: RoutesProps) {
    const { routeId, setRouteId, setDirection, setStopId } = props;

    const { data, isLoading, error } = useGetRoutes();

    const rollbar = useRollbar();

    if (isLoading) {
        return null;
    }

    if (error) {
        if (isAxiosError(error)) {
            const statusCode = (error as AxiosError).response?.status;

            if (statusCode === 404) {
                return (
                    <Alert severity='warning'>
                        There are no routes to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        rollbar.error(error);

        return (
            <Alert severity='error'>
                An error occurred while retrieving the route data. Please check back later.
            </Alert>
        );
    }

    if (data === undefined) {
        return null;
    }

    let routes: Route[] = data.data;

    if (routes.length === 0) {
        return (
            <Alert severity='warning'>
                There are no routes to choose from. Please check back later.
            </Alert>
        );
    }

    const options: Option[] = routes
        .map((route) => ({ id: route.id, label: `${route.name} (${route.id})` }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const selectedOption = options.find((option) => option.id === routeId) || null;

    return (
        <Autocomplete
            sx={{ p: 2, maxWidth: 500 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Route' />}
            options={options}
            value={selectedOption}
            defaultValue={null}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.label}
                </li>
            )}
            onChange={(_, value) => {
                if (!value) {
                    setRouteId(null);

                    setDirection(null);

                    setStopId(null);

                    localStorage.removeItem('routeId');

                    window.history.replaceState(null, '', window.location.pathname);

                    return;
                }

                setRouteId(value.id);

                setDirection(null);

                setStopId(null);

                localStorage.setItem('routeId', value.id);

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Routes;
