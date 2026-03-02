import {Alert, Box, CircularProgress, Paper, Typography} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {StopArrival, useGetStopArrivals} from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface BusesProps {
    routeId: string | null;
    stopId: string | null;
}

function getRouteColor(routeDesignator: string): string {
    if (/^N/i.test(routeDesignator)) return '#003087'; // Owl
    if (/^X/i.test(routeDesignator)) return '#00685e'; // X route
    if (/^J/i.test(routeDesignator)) return '#0066b3'; // Jump
    return '#58595b'; // Local (default)
}

function getTable(arrivals: StopArrival[]) {
    const destGroups: { destination: string; arrivals: StopArrival[] }[] = [];

    for (const arrival of arrivals) {
        const last = destGroups[destGroups.length - 1];

        if (!last || last.destination !== arrival.destination) {
            destGroups.push({ destination: arrival.destination, arrivals: [arrival] });
        } else {
            last.arrivals.push(arrival);
        }
    }

    return (
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {destGroups.map(({ destination, arrivals: destArrivals }) => {
                const [first, ...allRest] = destArrivals;
                const rest = allRest.slice(0, 2);
                const firstEta = first.etaMinutes;
                const firstLabel = firstEta <= 1 ? 'Due' : `${firstEta} min`;
                const firstColor = firstEta <= 1 ? '#4caf50' : first.delayed ? '#f44336' : '#e5e5e5';
                const statusSuffix = first.delayed ? ', Delayed' : '';
                const headerColor = getRouteColor(first.routeDesignator);

                return (
                    <Paper key={destination} sx={{ backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ px: 1.5, py: 0.25, backgroundColor: headerColor }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: '0.08em' }}>
                                {destination}
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1.5, py: 1.5 }}>
                            <Typography variant="h5" aria-label={`${firstLabel}${statusSuffix}`} sx={{ fontWeight: 700, color: firstColor, lineHeight: 1 }}>
                                {firstLabel}
                            </Typography>
                            {rest.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
                                    {rest.map((arrival) => {
                                        const eta = arrival.etaMinutes;
                                        const label = eta <= 1 ? 'Due' : `${eta} min`;
                                        const color = arrival.delayed ? '#f44336' : '#888';
                                        return (
                                            <Typography key={JSON.stringify(arrival)} variant="body2" component="span" sx={{ color, whiteSpace: 'nowrap' }}>
                                                {label}
                                            </Typography>
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                );
            })}
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

    const { data, error, isLoading, isFetching, dataUpdatedAt } = useGetStopArrivals(normalizedRouteId, normalizedStopId, {
        query: {
            enabled: (routeId != null) && (stopId != null),
            refetchInterval: 30000,
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

    const updatedAt = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : null;

    return (
        <Box>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                {isFetching && <CircularProgress size={12} thickness={5} sx={{ color: '#555' }} />}
                {updatedAt && (
                    <Typography variant="caption" sx={{ color: '#555' }}>
                        Updated {updatedAt}
                    </Typography>
                )}
            </Box>
            {getTable(sortedData)}
        </Box>
    );
}

export default Buses;
