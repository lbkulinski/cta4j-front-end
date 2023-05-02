import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {gql} from "./__generated__";
import {useQuery} from "@apollo/client";

interface TrainsProps {
    stationId: string | null
}

const GET_TRAINS = gql(`
query GetTrains($stationId: ID!) {
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

const routeToHexColor = new Map([
    ["RED", "#C60C30"],
    ["BLUE", "#00A1DE"],
    ["BROWN", "#62361B"],
    ["GREEN", "#009B3A"],
    ["ORANGE", "#F9461C"],
    ["PURPLE", "#522398"],
    ["PINK", "#E27EA6"],
    ["YELLOW", "#F9E300"]
]);

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
    const key = JSON.stringify(train);

    let rowStyles = {};

    if (train.due) {
        rowStyles = {
            backgroundColor: "#d1e7dd"
        };
    } else if (train.scheduled) {
        rowStyles = {
            backgroundColor: "#badce3"
        }
    } else if (train.delayed) {
        rowStyles = {
            backgroundColor: "#f8d7da"
        }
    }

    const routeColor = routeToHexColor.get(train.route);

    const routeStyles = (routeColor === undefined) ? {} : {color: routeColor};

    const arrivalDate = new Date(train.arrivalTime);

    const arrivalMillis = arrivalDate.getTime();

    const predictionDate = new Date(train.predictionTime);

    const predictionMillis = predictionDate.getTime();

    let difference = arrivalMillis - predictionMillis;

    const minuteMillis = 60000;

    difference /= minuteMillis;

    difference = Math.floor(difference);

    const eta = (difference <= 1) ? "Due" : `${difference} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell sx={routeStyles}>
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
            <TableCell>
                {
                    eta
                }
            </TableCell>
        </TableRow>
    );
}

function getTable(trains: Train[] | null) {
    if (trains === null) {
        return null;
    }

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

function compareTrains(train0: Train, train1: Train) {
    let route0 = train0.route;

    let destination0 = train0.destination;

    let date0 = new Date(train0.arrivalTime);

    let route1 = train1.route;

    let destination1 = train1.destination;

    let date1 = new Date(train1.arrivalTime);

    if (route0 < route1) {
        return -1;
    } else if (route0 > route1) {
        return 1;
    } else if (destination0 < destination1) {
        return -1;
    } else if (destination0 > destination1) {
        return 1;
    } else if (date0 < date1) {
        return -1;
    } else if (date0 === date1) {
        return 0;
    } else {
        return 1;
    }
}

function Trains(props: TrainsProps) {
    const stationId = props.stationId;

    const options = {
        skip: stationId === null,
        variables: {
            stationId: stationId!
        }
    }

    const {loading, error, data, startPolling} = useQuery(GET_TRAINS, options);

    if (loading) {
        return null;
    }

    if (error) {
        return null;
    }

    if (!data) {
        return null;
    }

    startPolling(60000);

    const trains = Array.from(data.getTrains);

    trains.sort(compareTrains);

    return getTable(trains);
}

export default Trains;
