import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Bus, useGetArrivals1} from "../api/generated.ts";

interface BusesProps {
    routeId: string | null,
    stopId: number | null
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
    const routeId = props.routeId ?? "";

    const stopId = props.stopId ?? 0;

    const queryOptions = {
        query: {
            enabled: routeId != null
        }
    };

    const {data, isLoading, error} = useGetArrivals1(routeId, stopId, queryOptions);

    const rollbar = useRollbar();

    if (isLoading) {
        return null;
    } else if (error) {
        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the bus data. Please check back later.
            </Alert>
        );
    } else if (!data || data.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming buses at this time. Please check back later.
            </Alert>
        );
    }

    data.sort(compareBuses);

    return getTable(data);
}

export default Buses;
