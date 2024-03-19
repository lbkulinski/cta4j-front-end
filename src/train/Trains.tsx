import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {gql} from "../__generated__";
import {useQuery} from "@apollo/client";
import {useRollbar} from "@rollbar/react";

interface TrainsProps {
    stationId: string | null
}

const GET_TRAINS = gql(`
query GetTrains($stationId: ID!) {
    getTrains(stationId: $stationId) {
        line
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

interface Train {
    line: string,
    destination: string,
    run: number,
    predictionTime: string,
    arrivalTime: string,
    due: boolean,
    scheduled: boolean,
    delayed: boolean
}

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

    const lineColor = lineToHexColor.get(train.line);

    const lineStyles = (lineColor === undefined) ? {} : {color: lineColor};

    const eta = getEta(train);

    const etaString = (eta <= 1) ? "Due" : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell sx={lineStyles}>
                {
                    train.line
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
        <Box sx={{p: 2}}>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: "bold"}}>Line</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Destination</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Run</TableCell>
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
        </Box>
    );
}

function compareTrains(train0: Train, train1: Train) {
    const line0 = train0.line;

    const destination0 = train0.destination;

    const date0 = new Date(train0.arrivalTime);

    const line1 = train1.line;

    const destination1 = train1.destination;

    const date1 = new Date(train1.arrivalTime);

    if (line0 < line1) {
        return -1;
    } else if (line0 > line1) {
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

    startPolling(60000);

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
                    There are no upcoming trains at this time. Please check back later.
                </Alert>
            );
        }

        const errorData = {
            error: error,
            data: data
        }

        const errorDataString = JSON.stringify(errorData);

        rollbar.error("An error occurred when trying to fetch the trains", errorDataString);
    }

    if (!data) {
        return null;
    }

    const trains = Array.from(data.getTrains);

    if (trains.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming trains at this time. Please check back later.
            </Alert>
        );
    }

    trains.sort(compareTrains);

    return getTable(trains);
}

export default Trains;
