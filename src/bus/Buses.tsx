import {Alert, Box, Paper, Typography} from '@mui/material';
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
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 600 }}>
            {destGroups.map(({ destination, arrivals: destArrivals }) => {
                const [first, ...rest] = destArrivals;
                const firstEta = first.etaMinutes;
                const firstLabel = firstEta <= 1 ? 'Due' : `${firstEta} min`;
                const firstColor = first.delayed ? '#f44336' : '#e5e5e5';
                const headerColor = getRouteColor(first.routeDesignator);

                return (
                    <Paper key={destination} sx={{ backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ px: 1.5, py: 0.5, backgroundColor: headerColor }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>
                                {destination}
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ textAlign: 'right', ml: 'auto' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: firstColor, lineHeight: 1.2 }}>
                                    {firstLabel}
                                </Typography>
                                {rest.length > 0 && (
                                    <Typography variant="caption" sx={{ color: '#555', lineHeight: 1.2 }}>
                                        {rest.map((arrival, idx) => {
                                            const eta = arrival.etaMinutes;
                                            const label = eta <= 1 ? 'Due' : `${eta} min`;
                                            return (
                                                <Box key={JSON.stringify(arrival)} component="span">
                                                    {idx > 0 && <Box component="span" sx={{ mx: 0.4 }}>·</Box>}
                                                    {label}
                                                </Box>
                                            );
                                        })}
                                    </Typography>
                                )}
                            </Box>
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
