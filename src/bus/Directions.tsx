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
    const routeId = props.routeId;

    const rollbar = useRollbar();

    const normalizedStationId = routeId ?? '';

    const {data, isLoading, error} = useGetDirections(normalizedStationId, {
        query: {
            enabled: routeId != null,
        },
    });

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const options: Option[] = React.useMemo(() => {
        if (!data) {
            return [];
        }

        const uniqueDirections = Array.from(new Set(data));

        return uniqueDirections.map((direction) => ({id: direction, label: direction }))
                               .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    React.useEffect(() => {
        if (isLoading || !data) {
            return;
        }

        const searchParams = new URLSearchParams(window.location.search);

        const urlDirection = searchParams.get('direction');

        const localStorageDirection = localStorage.getItem('direction');

        const defaultDirection = urlDirection ?? localStorageDirection;

        if (defaultDirection) {
            if (data.includes((defaultDirection as GetDirections200Item))) {
                setDefaultOption({ id: defaultDirection, label: defaultDirection });

                props.setDirection(defaultDirection);
            } else {
                props.setDirection(null);

                setDefaultOption(null);
            }
        }
    }, [isLoading, data, props]);

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
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    props.setDirection(null);

                    props.setStopId(null);

                    setDefaultOption(null);

                    localStorage.removeItem('direction');

                    localStorage.removeItem('stopId');

                    window.history.replaceState(null, '', window.location.pathname);

                    return;
                }

                props.setDirection(value.id);

                props.setStopId(null);

                setDefaultOption(value);

                localStorage.setItem('direction', value.id);
                
                localStorage.removeItem('stopId');

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Directions;
