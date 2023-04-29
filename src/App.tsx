import React from 'react';
import './App.css';
import {
    Autocomplete,
    Stack, TextField
} from "@mui/material";
import {useQuery} from '@apollo/client';
import {gql} from './__generated__';
import Trains from "./Trains";

const GET_STATIONS = gql(`
query GetStations {
    getStations {
        id
        name
    }
}
`);

interface Option {
    id: number;
    label: string;
}

function App() {
    const {loading, error, data} = useQuery(GET_STATIONS);

    const [stationId, setStationId] = React.useState<number | null>(null);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error : {error.message}</p>;
    }

    if (!data) {
        return <p>Error...</p>
    }

    const stations = data.getStations;

    const names = new Set<string>();

    const options = new Array<Option>();

    stations.forEach(station => {
        const name = station.name;

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: station.id,
            label: name
        });
    });

    options.sort((option0, option1) => option0.label.localeCompare(option1.label));

    return (
        <div>
            <Stack spacing={2}>
                <Autocomplete
                    sx={{p: 2, maxWidth: 500}}
                    renderInput={(params) => <TextField {...params} label="Station"/>}
                    options={options}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, value) => {
                        console.log(value);

                        if (!value) {
                            return;
                        }

                        setStationId(value.id);
                    }}
                />
                <Trains stationId={stationId}/>
            </Stack>
        </div>
    );
}

export default App;
