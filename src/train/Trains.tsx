import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {Train, useGetArrivals} from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface TrainsProps {
    stationId: number | null;
}

const lineToHexColor = new Map<string, string>([
    ['RED', '#C60C30'],
    ['BLUE', '#00A1DE'],
    ['BROWN', '#62361B'],
    ['GREEN', '#009B3A'],
    ['ORANGE', '#F9461C'],
    ['PURPLE', '#522398'],
    ['PINK', '#E27EA6'],
    ['YELLOW', '#F9E300'],
]);

function getEta(train: Train) {
    const arrivalTime = new Date(train.arrivalTime).getTime();

    const predictionTime = new Date(train.predictionTime).getTime();

    return Math.floor((arrivalTime - predictionTime) / 60000);
}

function getRow(train: Train) {
    const key = JSON.stringify(train);

    let backgroundColor: string | undefined;

    if (train.due) {
        backgroundColor = '#13251f';
    } else if (train.scheduled) {
        backgroundColor = '#172038';
    } else if (train.delayed) {
        backgroundColor = '#381717';
    }

    const rowStyles = {
        backgroundColor
    };

    const lineColor = lineToHexColor.get(train.line ?? '') ?? undefined;

    const lineStyles = lineColor ? { color: lineColor } : {};

    const eta = getEta(train);

    const etaString = (eta <= 1) ? 'Due' : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell sx={lineStyles}>{train.line}</TableCell>
            <TableCell>{train.destination}</TableCell>
            <TableCell>{train.run}</TableCell>
            <TableCell>{etaString}</TableCell>
        </TableRow>
    );
}

function getTable(trains: Train[]) {
    return (
        <Box sx={{ p: 2 }}>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Line</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Run</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{trains.map((train) => getRow(train))}</TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function compareTrains(train0: Train, train1: Train) {
    const lineComparison = train0.line.localeCompare(train1.line);

    if (lineComparison !== 0) {
        return lineComparison;
    }

    const destinationComparison = train0.destination.localeCompare(train1.destination);

    if (destinationComparison !== 0) {
        return destinationComparison;
    }

    const date0 = new Date(train0.arrivalTime).getTime();

    const date1 = new Date(train1.arrivalTime).getTime();

    return date0 - date1;
}

function Trains(props: TrainsProps) {
    const stationId = props.stationId;

    const rollbar = useRollbar();

    const normalizedStationId = stationId ?? -1;

    const { data, isLoading, error } = useGetArrivals(
        normalizedStationId,
        {
            query: {
                enabled: stationId != null,
                refetchInterval: 60000
            },
        }
    );

    if (stationId == null) {
        return null;
    }

    if (isLoading) {
        return null;
    }

    if (error) {
        rollbar.error(error);

        if (isAxiosError(error)) {
            const statusCode = (error as AxiosError).response?.status;

            if (statusCode === 404) {
                return (
                    <Alert severity="warning">
                        There are no upcoming trains at this time. Please check back later.
                    </Alert>
                );
            }
        }

        return (
            <Alert severity="error">
                An error occurred while retrieving the train data. Please check back later.
            </Alert>
        );
    }

    if (!data || (data.length === 0)) {
        return (
            <Alert severity="warning">
                There are no upcoming trains at this time. Please check back later.
            </Alert>
        );
    }

    const sortedData = [...data].sort(compareTrains);

    return getTable(sortedData);
}

export default Trains;
