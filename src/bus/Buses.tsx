import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {StopArrival, useGetStopArrivals} from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface BusesProps {
    routeId: string | null;
    stopId: string | null;
}

function getRow(arrival: StopArrival) {
    const key = JSON.stringify(arrival);

    let backgroundColor: string | undefined;

    const eta = arrival.etaMinutes;

    if (eta <= 1) {
        backgroundColor = '#13251f';
    } else if (arrival.delayed) {
        backgroundColor = '#381717';
    }

    const rowStyles = { backgroundColor };

    const etaString = eta <= 1 ? 'Due' : `${eta} min`;

    const cellStyles = { borderColor: 'rgba(255, 255, 255, 0.15)' };

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell sx={cellStyles}>{arrival.vehicleId}</TableCell>
            <TableCell sx={cellStyles}>{arrival.predictionType}</TableCell>
            <TableCell sx={cellStyles}>{arrival.destination}</TableCell>
            <TableCell sx={cellStyles}>{etaString}</TableCell>
        </TableRow>
    );
}

function getTable(arrivals: StopArrival[]) {
    return (
        <Box sx={{ p: 2 }}>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{arrivals.map((arrival) => getRow(arrival))}</TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function compareBuses(arrival0: StopArrival, arrival1: StopArrival) {
    const routeComparison = arrival0.route.localeCompare(arrival1.route);

    if (routeComparison !== 0) {
        return routeComparison;
    }

    const destinationComparison = arrival0.destination.localeCompare(arrival1.destination);

    if (destinationComparison !== 0) {
        return destinationComparison;
    }

    const date0 = new Date(arrival0.arrivalTime).getTime();

    const date1 = new Date(arrival1.arrivalTime).getTime();

    return date0 - date1;
}

function Buses(props: BusesProps) {
    const { routeId, stopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const normalizedStopId = stopId ?? '';

    const { data, error, isLoading } = useGetStopArrivals(normalizedRouteId, normalizedStopId, {
        query: {
            enabled: (routeId != null) && (stopId != null),
            refetchInterval: 60000,
        },
    });

    if ((routeId == null) || (stopId == null)) {
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
                        There are no upcoming buses at this time. Please check back later.
                    </Alert>
                );
            }
        }

        rollbar.error(error);

        return (
            <Alert severity="error">
                An error occurred while retrieving the bus data. Please check back later.
            </Alert>
        );
    }

    if (data === undefined) {
        return null;
    }

    const arrivals: StopArrival[] = data.data;

    if (arrivals.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming buses at this time. Please check back later.
            </Alert>
        );
    }

    const sortedData = [...arrivals].sort(compareBuses);

    return getTable(sortedData);
}

export default Buses;
