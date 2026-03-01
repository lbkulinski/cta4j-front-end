import {Alert, Box, CircularProgress, Paper, Typography} from '@mui/material';
import {useRollbar} from '@rollbar/react';
import {StationArrival, useGetStationArrivals} from '../api';
import {AxiosError, isAxiosError} from 'axios';

interface TrainsProps {
    stationId: string | null;
}

const routeToHexColor = new Map<string, string>([
    ['RED', '#C60C30'],
    ['BLUE', '#00A1DE'],
    ['BROWN', '#62361B'],
    ['GREEN', '#009B3A'],
    ['ORANGE', '#F9461C'],
    ['PURPLE', '#522398'],
    ['PINK', '#E27EA6'],
    ['YELLOW', '#F9E300'],
]);

function getTable(arrivals: StationArrival[]) {
    const lineGroups: { route: string; destinations: { destination: string; arrivals: StationArrival[] }[] }[] = [];

    for (const arrival of arrivals) {
        const lastLine = lineGroups[lineGroups.length - 1];

        if (!lastLine || lastLine.route !== arrival.route) {
            lineGroups.push({ route: arrival.route, destinations: [{ destination: arrival.destinationName, arrivals: [arrival] }] });
        } else {
            const lastDest = lastLine.destinations[lastLine.destinations.length - 1];

            if (!lastDest || lastDest.destination !== arrival.destinationName) {
                lastLine.destinations.push({ destination: arrival.destinationName, arrivals: [arrival] });
            } else {
                lastDest.arrivals.push(arrival);
            }
        }
    }

    return (
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {lineGroups.map(({ route, destinations }) => {
                const lineColor = routeToHexColor.get(route) ?? '#888';
                const headerTextColor = route === 'YELLOW' ? '#000' : '#fff';

                return (
                    <Paper key={route} sx={{ backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ px: 1.5, py: 0.5, backgroundColor: lineColor }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: headerTextColor, letterSpacing: '0.08em' }}>
                                {route}
                            </Typography>
                        </Box>
                        {destinations.map(({ destination, arrivals: destArrivals }, i) => {
                            const [first, ...rest] = destArrivals;
                            const firstEta = first.etaMinutes;
                            const firstLabel = firstEta <= 1 ? 'Due' : `${first.scheduled ? '~' : ''}${firstEta} min`;
                            const firstColor = first.approaching ? '#4caf50' : first.delayed ? '#f44336' : first.scheduled ? '#90caf9' : '#e5e5e5';

                            return (
                                <Box key={destination} sx={{ borderTop: i > 0 ? '1px solid #2a2a2a' : undefined, px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#888', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {'\u2192'} {destination}
                                    </Typography>
                                    <Box sx={{ textAlign: 'right' }}>
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
                            );
                        })}
                    </Paper>
                );
            })}
        </Box>
    );
}

const destinationOrder = new Map<string, number>([
    ['Linden', 0],
    ['Howard', 1],
    ['Dempster-Skokie', 2],
    ["O'Hare", 3],
    ['Kimball', 4],
    ['Harlem/Lake', 5],
    ['Forest Park', 6],
    ['54th/Cermak', 7],
    ['Midway', 8],
    ['Cottage Grove', 9],
    ['63rd', 10],
    ['95th/Dan Ryan', 11],
    ['Loop', 12],
]);

function compareArrivals(arrival0: StationArrival, arrival1: StationArrival) {
    const routeComparison = arrival0.route.localeCompare(arrival1.route);

    if (routeComparison !== 0) {
        return routeComparison;
    }

    const order0 = destinationOrder.get(arrival0.destinationName) ?? 99;
    const order1 = destinationOrder.get(arrival1.destinationName) ?? 99;
    const destinationComparison = order0 - order1;

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

    const normalizedStationId = stationId ?? "";

    const { data, isLoading, isFetching, dataUpdatedAt, error } = useGetStationArrivals(
        normalizedStationId,
        {
            query: {
                enabled: stationId != null,
                refetchInterval: 30000
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

    if (data === undefined) {
        return null;
    }

    const arrivals: StationArrival[] = data.data;

    if (arrivals.length === 0) {
        return (
            <Alert severity="warning">
                There are no upcoming trains at this time. Please check back later.
            </Alert>
        );
    }

    const sortedData = [...arrivals].sort(compareArrivals);

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

export default Trains;
