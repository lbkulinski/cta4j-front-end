import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Bus, useGetUpcomingStops} from "../api/generated.ts";
import {AxiosError, isAxiosError} from "axios";

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
                        buses.map((bus) => getRow(bus))
                    }
                </TableBody>
            </Table>
        </TableContainer>
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
    const id = 4374;

    const rollbar = useRollbar();

    const { data, isLoading, error } = useGetUpcomingStops(
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
                        <h2 style={{color: "#B3000C"}}>Holiday Bus &#127877;</h2>
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
                <h2 style={{color: "#B3000C"}}>Holiday Bus &#127877;</h2>
                <Alert severity="error">
                    An error occurred while retrieving the Holiday Bus data. Please check back later.
                </Alert>
            </Box>
        );
    }

    if (!data || (data.length === 0)) {
        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Bus &#127877;</h2>
                <Alert severity="warning">
                    The Holiday Bus does not appear to be running at this time. Please check back later.
                </Alert>
            </Box>
        );
    }

    const sortedData = [...data].sort(compareBuses);

    const destination = sortedData[0].destination;

    const route = sortedData[0].route;

    const table = getTable(sortedData);

    return (
        <Box sx={{p: 2}}>
            <h2 style={{color: "#B3000C"}}>Holiday Bus &#127877;</h2>
            <h3>{destination}-bound Route {route} (VID {id})</h3>
            {table}
        </Box>
    );
}

export default HolidayBus;
