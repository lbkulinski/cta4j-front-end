import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {Bus, useGetArrivals1} from '../api/generated';
import {AxiosError, isAxiosError} from 'axios';

interface BusesProps {
    routeId: string | null;
    stopId: number | null;
}

function getEta(bus: Bus) {
    const arrivalTime = new Date(bus.arrivalTime).getTime();

    const predictionTime = new Date(bus.predictionTime).getTime();

    return Math.floor((arrivalTime - predictionTime) / 60000);
}

function getRow(bus: Bus) {
    const key = JSON.stringify(bus);

    let backgroundColor: string | undefined;

    const eta = getEta(bus);

    if (eta <= 1) {
        backgroundColor = '#13251f';
    } else if (bus.delayed) {
        backgroundColor = '#381717';
    }

    const rowStyles = { backgroundColor };

    const etaString = eta <= 1 ? 'Due' : `${eta} min`;

    return (
        <TableRow key={key} sx={rowStyles}>
            <TableCell>{bus.id}</TableCell>
            <TableCell>{bus.type}</TableCell>
            <TableCell>{bus.destination}</TableCell>
            <TableCell>{etaString}</TableCell>
        </TableRow>
    );
}

function getTable(buses: Bus[]) {
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
                    <TableBody>{buses.map((bus) => getRow(bus))}</TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function compareBuses(bus0: Bus, bus1: Bus) {
    const routeComparison = bus0.route.localeCompare(bus1.route);

    if (routeComparison !== 0) {
        return routeComparison;
    }

    const destinationComparison = bus0.destination.localeCompare(bus1.destination);

    if (destinationComparison !== 0) {
        return destinationComparison;
    }

    const date0 = new Date(bus0.arrivalTime).getTime();

    const date1 = new Date(bus1.arrivalTime).getTime();

    return date0 - date1;
}

function Buses(props: BusesProps) {
    const { routeId, stopId } = props;

    const rollbar = useRollbar();

    const normalizedRouteId = routeId ?? '';

    const normalizedStopId = stopId ?? -1;

    const { data, isLoading, error } = useGetArrivals1(normalizedRouteId, normalizedStopId, {
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

    if (!data || (data.length === 0)) {
        return (
            <Alert severity="warning">
                There are no upcoming buses at this time. Please check back later.
            </Alert>
        );
    }

    const sortedData = [...data].sort(compareBuses);

    return getTable(sortedData);
}

export default Buses;
