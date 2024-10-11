import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRollbar} from "@rollbar/react";
import {Configuration, StationsApi, Train} from "../client";
import {useEffect, useState} from "react";

interface TrainsProps {
    stationId: number | null
}

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
    const arrivalMillis = train.arrivalTime.getTime();

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

    const line = train.line;

    let lineColor = undefined;

    if (line) {
        lineColor = lineToHexColor.get(line);
    }

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

    const date0 = train0.arrivalTime;

    const line1 = train1.line;

    const destination1 = train1.destination;

    const date1 = train1.arrivalTime;

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

    const [arrivals, setArrivals] = useState<Train[] | null>(null);

    const [error, setError] = useState<Error | null>(null);

    const rollbar = useRollbar();

    useEffect(() => {
        if (stationId === null) {
            setArrivals(null);
            
            return;
        }

        const apiConfiguration = new Configuration({
            basePath: import.meta.env.VITE_BACK_END_URL
        })

        const stationsApi = new StationsApi(apiConfiguration);

        stationsApi.getArrivals({stationId: stationId})
                   .then(response => {
                       setArrivals(response);
                   })
                   .catch(error => {
                       rollbar.error(error);

                       setError(error);
                   });
    }, [stationId, error, rollbar]);
    
    if (arrivals === null) {
        return null;
    } else if (error) {
        return (
            <Alert severity="error">
                An error occurred while retrieving the train data. Please check back later.
            </Alert>
        );
    } else if (arrivals.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming trains at this time. Please check back later.
            </Alert>
        );
    }

    arrivals.sort(compareTrains);

    return getTable(arrivals);
}

export default Trains;
