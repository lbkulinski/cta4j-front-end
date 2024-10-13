import React from 'react';
import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import { useGetRoutes } from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface RoutesProps {
    routeId: string | null;
    setRouteId: (routeId: string | null) => void;
    setDirection: (direction: string | null) => void;
    setStopId: (stopId: number | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Routes(props: RoutesProps) {
    const {data, isLoading, error} = useGetRoutes();

    const rollbar = useRollbar();

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const options: Option[] = React.useMemo(() => {
        if (!data) {
            return [];
        }

        const uniqueRoutes = new Map<string, Option>();

        data.forEach((route) => {
            const id = route.id.toString();

            const name = route.name;

            const label = `${name} (${id})`;

            if (!uniqueRoutes.has(name)) {
                uniqueRoutes.set(name, { id, label });
            }
        });

        return Array.from(uniqueRoutes.values())
                    .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    const getDefaultRouteId = React.useCallback((): string | null => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlRouteId = searchParams.get('routeId');

        const localStorageRouteId = localStorage.getItem('routeId');

        return urlRouteId ?? localStorageRouteId;
    }, []);

    React.useEffect(() => {
        if (isLoading || !data) {
            return;
        }

        const defaultRouteId = getDefaultRouteId();

        if (defaultRouteId) {
            const route = data.find((route) => route.id === defaultRouteId);

            if (route) {
                const id = route.id.toString();

                const label = `${route.name} (${id})`;

                setDefaultOption({id, label});

                props.setRouteId(id);
            } else {
                props.setRouteId(null);

                setDefaultOption(null);
            }
        }
    }, [isLoading, data, props]);

    if (isLoading) {
        return null;
    }

    if (error) {
        rollbar.error(error);

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

        return (
            <Alert severity='error'>
                An error occurred while retrieving the route data. Please check back later.
            </Alert>
        );
    }

    if (!data || (data.length === 0)) {
        return (
            <Alert severity='warning'>
                There are no routes to choose from. Please check back later.
            </Alert>
        );
    }

    return (
        <Autocomplete
            sx={{ p: 2, maxWidth: 500 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Route' />}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    props.setRouteId(null);

                    props.setDirection(null);

                    props.setStopId(null);

                    setDefaultOption(null);

                    localStorage.removeItem('routeId');

                    localStorage.removeItem('direction');

                    localStorage.removeItem('stopId');

                    window.history.replaceState(null, '', window.location.pathname);

                    return;
                }

                props.setRouteId(value.id);

                props.setDirection(null);

                props.setStopId(null);

                setDefaultOption(value);

                localStorage.setItem('routeId', value.id);

                localStorage.removeItem('direction');

                localStorage.removeItem('stopId');

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Routes;
