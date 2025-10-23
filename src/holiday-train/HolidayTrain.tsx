import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Train, UpcomingTrainArrival, useGetTrain} from "../api";
import {AxiosError, isAxiosError} from "axios";

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

function getRow(arrival: UpcomingTrainArrival) {
    const key = JSON.stringify(arrival);

    let rowStyles = {};

    if (arrival.approaching) {
        rowStyles = {
            backgroundColor: "#13251f"
        };
    } else if (arrival.scheduled) {
        rowStyles = {
            backgroundColor: "#172038"
        }
    } else if (arrival.delayed) {
        rowStyles = {
            backgroundColor: "#381717"
        }
    }

    const eta = arrival.etaMinutes;

    const etaString = (eta <= 1) ? "Due" : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell>
                {
                    arrival.stationName
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

function getTable(arrivals: UpcomingTrainArrival[]) {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: "bold"}}>Station</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>ETA</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        arrivals.map((train) => getRow(train))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function compareArrivals(arrival0: UpcomingTrainArrival, arrival1: UpcomingTrainArrival) {
    const route0 = arrival0.route;

    const date0 = new Date(arrival0.arrivalTime);

    const route1 = arrival1.route;

    const date1 = new Date(arrival1.arrivalTime);

    if (route0 < route1) {
        return -1;
    } else if (route0 > route1) {
        return 1;
    } else if (date0 < date1) {
        return -1;
    } else if (date0 === date1) {
        return 0;
    } else {
        return 1;
    }
}

function HolidayTrain() {
    const run = "1225";

    const rollbar = useRollbar();

    const { data, isLoading, error } = useGetTrain(
        run,
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
                        <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
                        <Alert severity="warning">
                            The Holiday Train does not appear to be running at this time. Please check back later.
                        </Alert>
                    </Box>
                );
            }
        }

        rollbar.error(error);

        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
                <Alert severity="error">
                    An error occurred while retrieving the Holiday Train data. Please check back later.
                </Alert>
            </Box>
        );
    }

    let train: Train | null;

    if (data === undefined) {
        train = null;
    } else {
        train = data.data;
    }

    if (train === null) {
        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
                <Alert severity="warning">
                    The Holiday Train does not appear to be running at this time. Please check back later.
                </Alert>
            </Box>
        );
    }

    let arrivals: UpcomingTrainArrival[] = train.arrivals;

    const sortedData = [...arrivals].sort(compareArrivals);

    const destination = sortedData[0].destinationName;

    const route = sortedData[0].route.toString()

    const lowercaseRoute = route.toLowerCase();

    const titleCaseRoute = lowercaseRoute.charAt(0).toUpperCase() + lowercaseRoute.slice(1);

    const routeColor = routeToHexColor.get(route);

    const table = getTable(sortedData);

    return (
        <Box sx={{p: 2}}>
            <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
            <h3>{destination}-bound <span style={{ color: routeColor }}>{titleCaseRoute}</span> Line Run 1225</h3>
            {table}
        </Box>
    );
}

export default HolidayTrain;
