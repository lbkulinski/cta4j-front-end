import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {gql} from "./__generated__";
import {useQuery} from "@apollo/client";

interface TrainsProps {
    stationId: number | null
}

const GET_TRAINS = gql(`
query GetTrains($stationId: Int!) {
    getTrains(stationId: $stationId) {
        route
        destination
        run
        predictionTime
        arrivalTime
        due
        scheduled
        delayed
    }
}
`);

interface Train {
    route: string,
    destination: string,
    run: number,
    predictionTime: string,
    arrivalTime: string,
    due: boolean,
    scheduled: boolean,
    delayed: boolean
}

function getRow(train: Train) {
    return (
        <TableRow key={train.run}>
            <TableCell>
                {
                    train.route
                }
            </TableCell>
            <TableCell>
                {
                    train.destination
                }
            </TableCell>
            <TableCell>
                {
                    train.run
                }
            </TableCell>
        </TableRow>
    );
}

function getTable(trains: Train[]) {
    return (
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
                            trains.map((train) => getRow(train))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function Trains(props: TrainsProps) {
    const stationId = props.stationId;

    const options = {
        skip: stationId === null,
        variables: {
            stationId: stationId!
        }
    }

    const {data} = useQuery(GET_TRAINS, options);

    if (!data) {
        return getTable([]);
    }

    const trains: Train[] = data.getTrains;

    return getTable(trains);
}

export default Trains;
