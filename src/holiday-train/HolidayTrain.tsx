import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Train, useGetUpcomingStations} from "../api/generated.ts";
import {AxiosError, isAxiosError} from "axios";

const lineToHexColor = new Map([
    ["RED", "#C60C30"],
    ["BLUE", "#00A1DE"],
    ["BROWN", "#62361B"],
    ["GREEN", "#009B3A"],
    ["ORANGE", "#F9461C"],
    ["PURPLE", "#522398"],
    ["PINK", "#E27EA6"],
    ["YELLOW", "#F9E300"]
]);

function getEta(train: Train) {
    const arrivalDate = new Date(train.arrivalTime);

    const arrivalMillis = arrivalDate.getTime();

    const predictionDate = new Date(train.predictionTime);

    const predictionMillis = predictionDate.getTime();

    let difference = arrivalMillis - predictionMillis;

    const minuteMillis = 60000;

    difference /= minuteMillis;

    difference = Math.floor(difference);

    return difference;
}

function getRow(train: Train) {
    const key = JSON.stringify(train);

    let rowStyles = {};

    if (train.due) {
        rowStyles = {
            backgroundColor: "#13251f"
        };
    } else if (train.scheduled) {
        rowStyles = {
            backgroundColor: "#172038"
        }
    } else if (train.delayed) {
        rowStyles = {
            backgroundColor: "#381717"
        }
    }

    const eta = getEta(train);

    const etaString = (eta <= 1) ? "Due" : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell>
                {
                    train.station
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

function getTable(trains: Train[] | null) {
    if (trains === null) {
        return null;
    }

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
                        trains.map((train) => getRow(train))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function compareTrains(train0: Train, train1: Train) {
    const line0 = train0.line;

    const date0 = new Date(train0.arrivalTime);

    const line1 = train1.line;

    const date1 = new Date(train1.arrivalTime);

    if (line0 < line1) {
        return -1;
    } else if (line0 > line1) {
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
    const run = 1225;

    const rollbar = useRollbar();

    const { data, isLoading, error } = useGetUpcomingStations(
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

    if (!data || (data.length === 0)) {
        return (
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
                <Alert severity="warning">
                    The Holiday Train does not appear to be running at this time. Please check back later.
                </Alert>
            </Box>
        );
    }

    const sortedData = [...data].sort(compareTrains);

    const destination = sortedData[0].destination;

    const line = sortedData[0].line.toString()

    const lowercaseLine = line.toLowerCase();

    const titleCaseLine = lowercaseLine.charAt(0).toUpperCase() + lowercaseLine.slice(1);

    const lineColor = lineToHexColor.get(line);

    const table = getTable(sortedData);

    return (
        <Box sx={{p: 2}}>
            <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;</h2>
            <h3>{destination}-bound <span style={{ color: lineColor }}>{titleCaseLine}</span> Line Run 1225</h3>
            {table}
        </Box>
    );
}

export default HolidayTrain;
