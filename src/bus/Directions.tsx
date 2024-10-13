import React from 'react';
import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import {GetDirections200Item, useGetDirections} from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface DirectionsProps {
    routeId: string | null;
    direction: string | null;
    setDirection: (direction: string | null) => void;
    setStopId: (stopId: number | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Directions(props: DirectionsProps) {
    const { routeId, setDirection, setStopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const { data, isLoading, error } = useGetDirections(normalizedRouteId, {
        query: {
            enabled: routeId != null,
        },
    });

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const options: Option[] = React.useMemo(() => {
        if (!data) {
            return [];
        }

        return data
            .map((direction) => ({ id: direction, label: direction }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    const getDefaultDirection = React.useCallback((): string | null => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlDirection = searchParams.get('direction');

        const localStorageDirection = localStorage.getItem('direction');

        return urlDirection ?? localStorageDirection;
    }, []);

    React.useEffect(() => {
        if (isLoading || !data) {
            return;
        }

        const defaultDirection = getDefaultDirection();

        if (defaultDirection) {
            const directionExists = data.includes(defaultDirection as GetDirections200Item);
            if (directionExists) {
                setDefaultOption({ id: defaultDirection, label: defaultDirection });

                setDirection(defaultDirection);
            } else {
                setDefaultOption(null);

                setDirection(null);

                setStopId(null);

                localStorage.removeItem('direction');

                localStorage.removeItem('stopId');
            }
        } else {
            setDefaultOption(null);
        }
    }, [isLoading, data, getDefaultDirection, setDirection, setStopId]);

    if (routeId == null) {
        return null;
    }

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
                        There are no directions to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        return (
            <Alert severity='error'>
                An error occurred while retrieving the direction data. Please check back later.
            </Alert>
        );
    }

    if (!data || (data.length === 0)) {
        return (
            <Alert severity='warning'>
                There are no directions to choose from. Please check back later.
            </Alert>
        );
    }

    return (
        <Autocomplete
            sx={{ p: 2, maxWidth: 500 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Direction' />}
            options={options}
            value={defaultOption}
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
                    setDirection(null);

                    setStopId(null);

                    localStorage.removeItem('direction');

                    localStorage.removeItem('stopId');

                    window.history.replaceState(null, '', window.location.pathname);

                    return;
                }

                setDirection(value.id);

                setStopId(null);

                localStorage.setItem('direction', value.id);

                localStorage.removeItem('stopId');

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Directions;
