import React from 'react';
import { useGetStations } from '../api/generated.ts';
import { Station } from '../api/generated';
import { Alert, Autocomplete, TextField } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import {AxiosError, isAxiosError} from 'axios';

interface Option {
    id: number;
    label: string;
}

interface StationsProps {
    stationId: number | null;
    setStationId: (id: number | null) => void;
}

function Stations(props: StationsProps) {
    const { data, isLoading, error } = useGetStations();

    const rollbar = useRollbar();

    const [defaultOption, setDefaultOption] = React.useState<Option | null>(null);

    const getDefaultStationId = React.useCallback((): number | null => {
        const searchParams = new URLSearchParams(window.location.search);

        const urlStationId = searchParams.get('stationId');

        const localStorageStationId = localStorage.getItem('stationId');

        const defaultStationId = urlStationId ?? localStorageStationId;

        return defaultStationId ? parseInt(defaultStationId, 10) : null;
    }, []);

    const options: Option[] = React.useMemo(() => {
        if (!data) return [];
        return data
            .map((station) => ({
                id: station.id,
                label: station.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    React.useEffect(() => {
        if (isLoading || !data) return;

        const stationIdNumber = getDefaultStationId();

        if (stationIdNumber != null) {
            const station = data.find((station: Station) => station.id === stationIdNumber);

            if (station) {
                props.setStationId(stationIdNumber);
                setDefaultOption({ id: station.id, label: station.name });
            } else {
                props.setStationId(null);
                setDefaultOption(null);
            }
        }
    }, [isLoading, data, getDefaultStationId, props]);

    if (isLoading) {
        return null;
    }

    if (error) {
        rollbar.error(error);

        if (isAxiosError(error)) {
            const statusCode = (error as AxiosError).response?.status;

            if (statusCode === 404) {
                return (
                    <Alert severity="warning">
                        There are no stations to choose from. Please check back later.
                    </Alert>
                );
            }
        }

        return (
            <Alert severity="error">
                An error occurred while retrieving the station data. Please check back later.
            </Alert>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Alert severity="warning">
                There are no stations to choose from. Please check back later.
            </Alert>
        );
    }

    return (
        <Autocomplete
            sx={{ p: 2, maxWidth: 500 }}
            size="small"
            renderInput={(params) => <TextField {...params} label="Station" />}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    return;
                }

                props.setStationId(value.id);
                setDefaultOption(value);
                localStorage.setItem('stationId', String(value.id));
                window.history.replaceState(null, '', window.location.pathname);
            }}
        />
    );
}

export default Stations;