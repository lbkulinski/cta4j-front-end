import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {gql} from "../__generated__";
import {useQuery} from "@apollo/client";
import {useRollbar} from "@rollbar/react";

interface BusesProps {
    routeId: string | null,
    stopId: string | null
}

const GET_BUSES = gql(`
query GetBuses($routeId: ID!, $stopId: ID!) {
    getBuses(routeId: $routeId, stopId: $stopId) {
        id
        type
        stop
        route
        destination
        delayed
        eta
    }
}
`);

interface Bus {
    id: string,
    type: string,
    stop: string,
    route: string,
    destination: string,
    delayed: boolean,
    eta: number
}

function getRow(bus: Bus) {
    const key = JSON.stringify(bus);

    let rowStyles = {};

    const eta = bus.eta;

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

    const eta0 = bus0.eta;

    const route1 = bus1.route;

    const destination1 = bus1.destination;

    const eta1 = bus1.eta;

    if (route0 < route1) {
        return -1;
    } else if (route0 > route1) {
        return 1;
    } else if (destination0 < destination1) {
        return -1;
    } else if (destination0 > destination1) {
        return 1;
    } else if (eta0 < eta1) {
        return -1;
    } else if (eta0 === eta1) {
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

    const {loading, error, data, startPolling} = useQuery(GET_BUSES, options);

    startPolling(60000);

    const rollbar = useRollbar();

    if (loading) {
        return null;
    }

    if (error) {
        const errorData = {
            error: error,
            data: data
        }

        const errorDataString = JSON.stringify(errorData);

        rollbar.error("An error occurred when trying to fetch the buses", errorDataString);

        return (
            <Alert severity="error">
                Error: The buses could not be loaded. Please refresh the page or try again later.
            </Alert>
        );
    }

    if (!data) {
        return null;
    }

    const buses = Array.from(data.getBuses);

    buses.sort(compareBuses);

    return getTable(buses);
}

export default Buses;
