import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {gql} from "../__generated__";
import {useQuery} from "@apollo/client";
import {useRollbar} from "@rollbar/react";

const BUS = gql(`
query Bus {
    bus(id: "4374") {
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
    const key = crypto.randomUUID();

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
                    bus.route
                }
            </TableCell>
            <TableCell>
                {
                    bus.type
                }
            </TableCell>
            <TableCell>
                {
                    bus.stop
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
                            <TableCell sx={{fontWeight: "bold"}}>Route</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Type</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Stop</TableCell>
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
    const date0 = new Date(bus0.arrivalTime);

    const date1 = new Date(bus1.arrivalTime);

    if (date0 < date1) {
        return -1;
    } else if (date0 === date1) {
        return 0;
    } else {
        return 1;
    }
}

function HolidayBus() {
    const {loading, error, data, startPolling} = useQuery(BUS);

    startPolling(60000);

    const rollbar = useRollbar();

    if (loading) {
        return null;
    }

    if (error) {
        const classifications = error.graphQLErrors.map(graphQLError => graphQLError.extensions.classification);

        const set = new Set(classifications);

        if (set.has("NOT_FOUND")) {
            return (
                <Alert severity="warning">
                    The Holiday Bus does not appear to be running at this time. Please check back later.
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

    const buses = Array.from(data.bus);

    buses.sort(compareBuses);

    return getTable(buses);
}

export default HolidayBus;
