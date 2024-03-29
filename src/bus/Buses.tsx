import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {gql} from "../__generated__";
import {useSubscription} from "@apollo/client";
import {useRollbar} from "@rollbar/react";

interface BusesProps {
    routeId: string | null,
    stopId: string | null
}

const BUSES_SUBSCRIBE = gql(`
subscription BusesSubscribe($routeId: ID!, $stopId: ID!) {
    busesSubscribe(routeId: $routeId, stopId: $stopId) {
        id
        type
        stop
        route
        destination
        predictionTime
        arrivalTime
        delayed
    }
}
`);

interface Bus {
    id: string,
    type: string,
    stop: string,
    route: string,
    destination: string,
    predictionTime: string,
    arrivalTime: string,
    delayed: boolean
}

function getEta(bus: Bus) {
    const arrivalDate = new Date(bus.arrivalTime);

    const arrivalMillis = arrivalDate.getTime();

    const predictionDate = new Date(bus.predictionTime);

    const predictionMillis = predictionDate.getTime();

    let difference = arrivalMillis - predictionMillis;

    const minuteMillis = 60000;

    difference /= minuteMillis;

    return Math.floor(difference);
}

function getRow(bus: Bus) {
    const key = JSON.stringify(bus);

    let rowStyles = {};

    const eta = getEta(bus);

    if (eta <= 1) {
        rowStyles = {
            backgroundColor: "#13251f"
        };
    } else if (bus.delayed) {
        rowStyles = {
            backgroundColor: "#381717"
        }
    }

    const etaString = (eta <= 1) ? "Due" : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell>
                {
                    bus.id
                }
            </TableCell>
            <TableCell>
                {
                    bus.type
                }
            </TableCell>
            <TableCell>
                {
                    bus.destination
                }
            </TableCell>
            <TableCell>
                {
                    etaString
                }
            </TableCell>
        </TableRow>
    );
}

function getTable(buses: Bus[] | null) {
    if (buses === null) {
        return null;
    }

    return (
        <Box sx={{p: 2}}>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: "bold"}}>ID</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Type</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Destination</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>ETA</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            buses.map((bus) => getRow(bus))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function compareBuses(bus0: Bus, bus1: Bus) {
    const route0 = bus0.route;

    const destination0 = bus0.destination;

    const date0 = new Date(bus0.arrivalTime);

    const route1 = bus1.route;

    const destination1 = bus1.destination;

    const date1 = new Date(bus1.arrivalTime);

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

function Buses(props: BusesProps) {
    const routeId = props.routeId;

    const stopId = props.stopId;

    const options = {
        skip: (routeId === null) || (stopId === null),
        variables: {
            routeId: routeId!,
            stopId: stopId!
        }
    }

    const {loading, error, data} = useSubscription(BUSES_SUBSCRIBE, options);

    const rollbar = useRollbar();

    if (loading) {
        return null;
    }

    if (error) {
        const errorTypes = error.graphQLErrors.map(graphQLError => graphQLError.extensions.errorType);

        const set = new Set(errorTypes);

        if (set.has("NOT_FOUND")) {
            return (
                <Alert severity="warning">
                    There are no upcoming buses at this time. Please check back later.
                </Alert>
            );
        }

        const errorData = {
            error: error,
            data: data
        }

        const errorDataString = JSON.stringify(errorData);

        rollbar.error("An error occurred when trying to fetch the buses", errorDataString);
    }

    if (!data) {
        return null;
    }

    const buses = Array.from(data.busesSubscribe);

    if (buses.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming buses at this time. Please check back later.
            </Alert>
        );
    }

    buses.sort(compareBuses);

    return getTable(buses);
}

export default Buses;
