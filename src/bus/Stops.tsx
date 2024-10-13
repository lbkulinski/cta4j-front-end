import React from 'react';
import {Alert, Autocomplete, TextField} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {useGetStops} from '../api/generated';
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
    const { routeId, direction, setStopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const normalizedDirectionValue = direction ?? '';

    const { data, isLoading, error } = useGetStops(normalizedRouteId, normalizedDirectionValue, {
        query: {
            enabled: routeId != null && direction != null,
        },
    });

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const options: Option[] = React.useMemo(() => {
        if (!data) {
            return [];
        }

        return data
            .map((stop) => ({ id: stop.id, label: stop.name }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    const getDefaultStopId = React.useCallback((): number | null => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStopId = searchParams.get('stopId');

        const localStorageStopId = localStorage.getItem('stopId');

        const defaultStopIdString = urlStopId ?? localStorageStopId;

        return defaultStopIdString ? parseInt(defaultStopIdString, 10) : null;
    }, []);

    React.useEffect(() => {
        if (isLoading || !data) {
            return;
        }

        const defaultStopId = getDefaultStopId();

        if (defaultStopId != null) {
            const stopExists = data.some((stop) => stop.id === defaultStopId);

            if (stopExists) {
                const stop = data.find((stop) => stop.id === defaultStopId)!;

                setDefaultOption({ id: stop.id, label: stop.name });

                setStopId(defaultStopId);
            } else {
                setDefaultOption(null);

                setStopId(null);

                localStorage.removeItem('stopId');
            }
        } else {
            setDefaultOption(null);
        }
    }, [isLoading, data, getDefaultStopId, setStopId]);

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
            sx={{ p: 2, maxWidth: 500 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Stop' />}
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
                    setStopId(null);
                    
                    localStorage.removeItem('stopId');
                    
                    window.history.replaceState(null, '', window.location.pathname);
                    
                    return;
                }

                setStopId(value.id);
                
                localStorage.setItem('stopId', String(value.id));
                
                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Stops;
