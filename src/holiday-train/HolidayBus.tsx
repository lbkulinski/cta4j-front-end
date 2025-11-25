import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Bus, UpcomingBusArrival, useGetBus} from "../api";
import {AxiosError, isAxiosError} from "axios";

function getRow(arrival: UpcomingBusArrival) {
    const key = crypto.randomUUID();

    let rowStyles = {};

    const eta = arrival.etaMinutes;

    if (eta <= 1) {
        rowStyles = {
            backgroundColor: "#13251f"
        };
    } else if (arrival.delayed) {
        rowStyles = {
            backgroundColor: "#381717"
        }
    }

    const etaString = (eta <= 1) ? "Due" : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell>
                {
                    arrival.stopName
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

function getTable(arrivals: UpcomingBusArrival[]) {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: "bold"}}>Stop</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>ETA</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        arrivals.map((bus) => getRow(bus))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function compareArrivals(arrival0: UpcomingBusArrival, arrival1: UpcomingBusArrival) {
    const date0 = new Date(arrival0.arrivalTime);

    const date1 = new Date(arrival1.arrivalTime);

    if (date0 < date1) {
        return -1;
    } else if (date0 === date1) {
        return 0;
    } else {
        return 1;
    }
}

function HolidayBus() {
    const id = "4374";

    const rollbar = useRollbar();

    const { data, isLoading, error } = useGetBus(
        id,
        {
            query: {
                refetchInterval: 60000
            },
        }
    );

    if (isLoading) {
        return null;
    }

    if (error) {
        if (isAxiosError(error)) {
            const statusCode = (error as AxiosError).response?.status;

            if (statusCode === 404) {
                return (
                    <Box sx={{p: 2}}>
                        <h2 style={{color: "#B3000C"}}>Holiday Bus 🎅🏻</h2>
                        <Alert severity="warning">
                            The Holiday Bus does not appear to be running at this time. Please check back later.
                        </Alert>
                    </Box>
                );
            }
        }

        rollbar.error(error);

        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Bus 🎅🏻</h2>
                <Alert severity="error">
                    An error occurred while retrieving the Holiday Bus data. Please check back later.
                </Alert>
            </Box>
        );
    }

    let bus: Bus | null;

    if (data === undefined) {
        bus = null;
    } else {
        bus = data.data;
    }

    if (bus === null) {
        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Bus 🎅🏻</h2>
                <Alert severity="warning">
                    The Holiday Bus does not appear to be running at this time. Please check back later.
                </Alert>
            </Box>
        );
    }

    let arrivals: UpcomingBusArrival[] = bus.arrivals;

    if (arrivals.length === 0) {
        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Bus 🎅🏻</h2>
                <Alert severity="warning">
                    The Holiday Bus does not appear to be running at this time. Please check back later.
                </Alert>
            </Box>
        );
    }

    const sortedData = [...arrivals].sort(compareArrivals);

    const destination = sortedData[0].destination;

    const route = sortedData[0].route;

    const table = getTable(sortedData);

    return (
        <Box sx={{p: 2}}>
            <h2 style={{color: "#B3000C"}}>Holiday Bus 🎅🏻</h2>
            <h3>{destination}-bound Route {route} (VID {id})</h3>
            {table}
        </Box>
    );
}

export default HolidayBus;
