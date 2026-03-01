import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import {useGetDirections} from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface DirectionsProps {
    routeId: string | null;
    direction: string | null;
    setDirection: (direction: string | null) => void;
    setStopId: (stopId: string | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Directions(props: DirectionsProps) {
    const { routeId, direction, setDirection, setStopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const { data, isLoading, error } = useGetDirections(normalizedRouteId, {
        query: {
            enabled: routeId != null,
        },
    });

    if (routeId == null) {
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
                        There are no directions to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        rollbar.error(error);

        return (
            <Alert severity='error'>
                An error occurred while retrieving the direction data. Please check back later.
            </Alert>
        );
    }

    if (data === undefined) {
        return null;
    }

    const directions: string[] = data.data;

    if (directions.length === 0) {
        return (
            <Alert severity='warning'>
                There are no directions to choose from. Please check back later.
            </Alert>
        );
    }

    const options: Option[] = directions.map((dir) => ({ id: dir, label: dir }));

    const selectedOption = options.find((option) => option.id === direction) || null;

    return (
        <Autocomplete
            sx={{ p: 1.5, maxWidth: 600 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Direction' />}
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
                    setDirection(null);

                    setStopId(null);

                    localStorage.removeItem('direction');

                    localStorage.removeItem('stopId');

                    return;
                }

                setDirection(value.id);

                setStopId(null);

                localStorage.setItem('direction', value.id);

                localStorage.removeItem('stopId');
            }}
        />
    );
}

export default Directions;
