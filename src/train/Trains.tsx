import {Alert, Box, Chip, Paper, Typography} from '@mui/material';
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
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {lineGroups.map(({ route, destinations }) => {
                const lineColor = routeToHexColor.get(route) ?? '#888';
                const headerTextColor = route === 'YELLOW' ? '#000' : '#fff';

                return (
                    <Paper key={route} sx={{ backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, backgroundColor: lineColor }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: headerTextColor }}>
                                {route}
                            </Typography>
                        </Box>
                        {destinations.map(({ destination, arrivals: destArrivals }, i) => (
                            <Box key={destination} sx={{ borderTop: i > 0 ? '1px solid #2a2a2a' : undefined, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#888', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {'\u2192'} {destination}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'flex-end' }}>
                                    {destArrivals.map((arrival) => {
                                        let chipBg = '#2a2a2a';

                                        if (arrival.approaching) {
                                            chipBg = '#13251f';
                                        } else if (arrival.delayed) {
                                            chipBg = '#381717';
                                        } else if (arrival.scheduled) {
                                            chipBg = '#172038';
                                        }

                                        const eta = arrival.etaMinutes;
                                        const etaString = eta <= 1 ? 'Due' : `${eta} min`;

                                        return (
                                            <Chip key={JSON.stringify(arrival)} label={etaString} size="small" sx={{ backgroundColor: chipBg, color: '#e5e5e5', fontWeight: 'bold', border: '1px solid #3a3a3a' }} />
                                        );
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                );
            })}
        </Box>
    );
}

function compareArrivals(arrival0: StationArrival, arrival1: StationArrival) {
    const routeComparison = arrival0.route.localeCompare(arrival1.route);

    if (routeComparison !== 0) {
        return routeComparison;
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

    const normalizedStationId = stationId ?? "";

    const { data, isLoading, error } = useGetStationArrivals(
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

    return getTable(sortedData);
}

export default Trains;
