import React from 'react';
import './App.css';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem, Paper,
    Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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

    if (!stations) {
        return <p>Error...</p>
    }

    return (
        <div>
            <Stack spacing={2}>
                <FormControl sx={{m: 2, maxWidth: 500}} size="small">
                    <InputLabel>
                        Station
                    </InputLabel>
                    <Select autoWidth>
                        {
                            stations.map(station => {
                                return (
                                    <MenuItem value={station.id}>
                                        {
                                            station.name
                                        }
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
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
