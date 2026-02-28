import {Alert, Autocomplete, TextField} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {Stop, useGetStops} from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface StopsProps {
    routeId: string | null;
    direction: string | null;
    stopId: string | null;
    setStopId: (stopId: string | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Stops(props: StopsProps) {
    const { routeId, direction, stopId, setStopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const normalizedDirectionValue = direction ?? '';

    const { data, isLoading, error } = useGetStops(normalizedRouteId, normalizedDirectionValue, {
        query: {
            enabled: routeId != null && direction != null,
        },
    });

    if ((routeId == null) || (direction == null)) {
        return null;
    }

    if (isLoading) {
        return null;
    }

    if (error) {
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

        rollbar.error(error);

        return (
            <Alert severity='error'>
                An error occurred while retrieving the stop data. Please check back later.
            </Alert>
        );
    }

    if (data === undefined) {
        return null;
    }

    const stops: Stop[] = data.data;

    if (stops.length === 0) {
        return (
            <Alert severity='warning'>
                There are no stops to choose from. Please check back later.
            </Alert>
        );
    }

    const options: Option[] = stops.map((stop) => ({ id: stop.id, label: stop.name }));

    const selectedOption = options.find((option) => option.id === stopId) || null;

    return (
        <Autocomplete
            sx={{ p: 2, maxWidth: 500 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Stop' />}
            options={options}
            value={selectedOption}
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
                    
                    return;
                }

                setStopId(value.id);
                
                localStorage.setItem('stopId', String(value.id));
            }}
        />
    );
}

export default Stops;
