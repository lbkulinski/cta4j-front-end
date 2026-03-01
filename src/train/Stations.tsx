import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import { Station, useGetStations } from '../api';
import { AxiosError, isAxiosError } from 'axios';

interface StationsProps {
    stationId: string | null;
    setStationId: (stationId: string | null) => void;
}

interface Option {
    id: string;
    label: string;
}

function Stations(props: StationsProps) {
    const { stationId, setStationId } = props;

    const { data, isLoading, error } = useGetStations();
    
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
                        There are no stations to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        rollbar.error(error);

        return (
            <Alert severity='error'>
                An error occurred while retrieving the station data. Please check back later.
            </Alert>
        );
    }

    if (data === undefined) {
        return null;
    }

    const stations: Station[] = data.data;

    if (stations.length === 0) {
        return (
            <Alert severity='warning'>
                There are no stations to choose from. Please check back later.
            </Alert>
        );
    }

    const options: Option[] = stations.map((station) => ({ id: station.id, label: station.name }))
                                      .sort((a, b) => a.label.localeCompare(b.label));

    const selectedOption = options.find((option) => option.id === stationId) || null;

    return (
        <Autocomplete
            sx={{ p: 1.5 }}
            size='small'
            renderInput={(params) => <TextField {...params} label='Station' />}
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
                    setStationId(null);

                    localStorage.removeItem('stationId');

                    window.history.replaceState(null, '', window.location.pathname);

                    return;
                }

                setStationId(value.id);

                localStorage.setItem('stationId', String(value.id));

                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Stations;
