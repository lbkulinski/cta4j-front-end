import {Alert, Box, Paper, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material';
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
    const groups: { route: string; destination: string; arrivals: StationArrival[] }[] = [];

    for (const arrival of arrivals) {
        const last = groups[groups.length - 1];

        if (last && last.route === arrival.route && last.destination === arrival.destinationName) {
            last.arrivals.push(arrival);
        } else {
            groups.push({ route: arrival.route, destination: arrival.destinationName, arrivals: [arrival] });
        }
    }

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groups.map(({ route, destination, arrivals: groupArrivals }) => {
                const lineColor = routeToHexColor.get(route);

                return (
                    <Paper key={`${route}-${destination}`} sx={{ overflow: 'hidden', borderTop: `3px solid ${lineColor}` }}>
                        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: lineColor }}>
                                {route} {'\u2192'} {destination}
                            </Typography>
                        </Box>
                        <Table size="small">
                            <TableBody>
                                {groupArrivals.map((arrival) => {
                                    let backgroundColor: string | undefined;

                                    if (arrival.approaching) {
                                        backgroundColor = '#13251f';
                                    } else if (arrival.scheduled) {
                                        backgroundColor = '#172038';
                                    } else if (arrival.delayed) {
                                        backgroundColor = '#381717';
                                    }

                                    const eta = arrival.etaMinutes;
                                    const etaString = eta <= 1 ? 'Due' : `${eta} min`;

                                    return (
                                        <TableRow key={JSON.stringify(arrival)} sx={{ backgroundColor }}>
                                            <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}>{arrival.run}</TableCell>
                                            <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}>{etaString}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
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
