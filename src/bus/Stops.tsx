import React from 'react';
import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import { useGetStops } from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface StopsProps {
    routeId: string | null;
    direction: string | null;
    stopId: number | null;
    setStopId: (stopId: number | null) => void;
}

interface Option {
    id: number;
    label: string;
}

function Stops(props: StopsProps) {
    const {routeId, direction} = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const normalizedDirectionValue = direction ?? '';

    const {data, isLoading, error} = useGetStops(normalizedRouteId, normalizedDirectionValue, {
        query: {
            enabled: (routeId != null) && (direction != null),
        },
    });

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const options: Option[] = React.useMemo(() => {
        if (!data) {
            return [];
        }

        return data.map((station) => ({id: station.id, label: station.name,}))
                   .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    React.useEffect(() => {
        if (isLoading || !data) {
            return;
        }

        const searchParams = new URLSearchParams(window.location.search);

        const urlStopId = searchParams.get('stopId');

        const localStorageStopId = localStorage.getItem('stopId');

        const defaultStopIdString = urlStopId ?? localStorageStopId;

        const defaultStopId = defaultStopIdString ? parseInt(defaultStopIdString, 10) : null;

        if (defaultStopId != null) {
            const stop = data.find((stop) => stop.id === defaultStopId);

            if (stop) {
                setDefaultOption({id: stop.id, label: stop.name});

                props.setStopId(stop.id);
            } else {
                props.setStopId(null);

                setDefaultOption(null);
            }
        }
    }, [isLoading, data, props]);

    if ((routeId == null) || (direction == null)) {
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
                        There are no stops to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        return (
            <Alert severity='error'>
                An error occurred while retrieving the stop data. Please check back later.
            </Alert>
        );
    }

    if (!data || (data.length === 0)) {
        return (
            <Alert severity='warning'>
                There are no stops to choose from. Please check back later.
            </Alert>
        );
    }
    
    return (
        <Autocomplete
            sx={{p: 2, maxWidth: 500}}
            size='small'
            renderInput={(params) => <TextField {...params} label='Stop' />}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    props.setStopId(null);
                    
                    setDefaultOption(null);
                    
                    localStorage.removeItem('stopId');
                    
                    window.history.replaceState(null, '', window.location.pathname);
                    
                    return;
                }

                props.setStopId(value.id);
                
                setDefaultOption(value);

                localStorage.setItem('stopId', String(value.id));

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Stops;
