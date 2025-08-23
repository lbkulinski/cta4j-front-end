import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {TrainArrival, useGetArrivals} from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface TrainsProps {
    stationId: string | null;
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

function getRow(arrival: TrainArrival) {
    const key = JSON.stringify(arrival);

    let backgroundColor: string | undefined;

    if (arrival.approaching) {
        backgroundColor = '#13251f';
    } else if (arrival.scheduled) {
        backgroundColor = '#172038';
    } else if (arrival.delayed) {
        backgroundColor = '#381717';
    }

    const rowStyles = {
        backgroundColor
    };

    const lineColor = lineToHexColor.get(arrival.route ?? '') ?? undefined;

    const lineStyles = lineColor ? { color: lineColor } : {};

    const eta = arrival.etaMinutes;

    const etaString = (eta <= 1) ? 'Due' : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell sx={lineStyles}>{arrival.route}</TableCell>
            <TableCell>{arrival.destinationName}</TableCell>
            <TableCell>{arrival.run}</TableCell>
            <TableCell>{etaString}</TableCell>
        </TableRow>
    );
}

function getTable(arrivals: TrainArrival[]) {
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
                    <TableBody>{arrivals.map((train) => getRow(train))}</TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function compareTrains(arrival0: TrainArrival, arrival1: TrainArrival) {
    const lineComparison = arrival0.route.localeCompare(arrival1.route);

    if (lineComparison !== 0) {
        return lineComparison;
    }

    const destinationComparison = arrival0.destinationName.localeCompare(arrival1.destinationName);

    if (destinationComparison !== 0) {
        return destinationComparison;
    }

    const date0 = new Date(arrival0.arrivalTime).getTime();

    const date1 = new Date(arrival1.arrivalTime).getTime();

    return date0 - date1;
}

function Trains(props: TrainsProps) {
    const stationId = props.stationId;

    const rollbar = useRollbar();

    const normalizedStationId = stationId ?? '';

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

        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the train data. Please check back later.
            </Alert>
        );
    }

    if (!data || (data.data.length === 0)) {
        return (
            <Alert severity="warning">
                There are no upcoming trains at this time. Please check back later.
            </Alert>
        );
    }

    const sortedData = [...data.data].sort(compareTrains);

    return getTable(sortedData);
}

export default Trains;
