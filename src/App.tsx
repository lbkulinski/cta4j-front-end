import React from 'react';
import './App.css';
import {
    Autocomplete,
    Box,
    Paper,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from "@mui/material";
import {useQuery} from '@apollo/client';
import { gql } from './__generated__';

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
    label?: string | null;
}

function App() {
    const [station, setStation] = React.useState(null);

    const { loading, error, data } = useQuery(GET_STATIONS);

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

    return (
        <div>
            <Stack spacing={2}>
                <Autocomplete
                    sx={{p: 2, maxWidth: 500}}
                    disablePortal
                    renderInput={(params) => <TextField {...params} label="Station" />}
                    options={options}
                />
                <Box sx={{p: 2}}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Route</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Run</TableCell>
                                    <TableCell>ETA</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {

                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Stack>
        </div>
    );
}

export default App;
