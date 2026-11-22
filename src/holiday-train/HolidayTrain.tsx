import {useRollbar} from "@rollbar/react";
import {UpcomingTrainArrival, useGetTrain} from "../api";
import {AxiosError, isAxiosError} from "axios";
import {HolidayCard, HolidayEmpty, HolidayMessage, HolidaySection} from "./HolidaySection.tsx";

const routeToHexColor = new Map<string, string>([
    ["RED", "#C60C30"],
    ["BLUE", "#00A1DE"],
    ["BROWN", "#62361B"],
    ["GREEN", "#009B3A"],
    ["ORANGE", "#F9461C"],
    ["PURPLE", "#522398"],
    ["PINK", "#E27EA6"],
    ["YELLOW", "#F9E300"]
]);

function compareArrivals(arrival0: UpcomingTrainArrival, arrival1: UpcomingTrainArrival) {
    const routeComparison = arrival0.route.localeCompare(arrival1.route);

    if (routeComparison !== 0) {
        return routeComparison;
    }

    return new Date(arrival0.arrivalTime).getTime() - new Date(arrival1.arrivalTime).getTime();
}

const notRunning = (
    <HolidaySection title="Holiday Train">
        <HolidayEmpty vehicle="Train"/>
    </HolidaySection>
);

function HolidayTrain() {
    const run = "1225";

    const rollbar = useRollbar();

    const { data, isLoading, isFetching, dataUpdatedAt, error } = useGetTrain(
        run,
        {
            query: {
                refetchInterval: 60000
            },
        }
    );

    if (isLoading) {
        return null;
    }

    if (error) {
        if (isAxiosError(error) && (error as AxiosError).response?.status === 404) {
            return notRunning;
        }

        rollbar.error(error);

        return (
            <HolidaySection title="Holiday Train">
                <HolidayMessage>
                    An error occurred while retrieving the Holiday Train data. Please check back later.
                </HolidayMessage>
            </HolidaySection>
        );
    }

    const train = data?.data ?? null;

    if (train === null || !Array.isArray(train.arrivals) || train.arrivals.length === 0) {
        return notRunning;
    }

    const sortedData = [...train.arrivals].sort(compareArrivals);

    const route = sortedData[0].route.toString();

    const titleCaseRoute = route.charAt(0) + route.slice(1).toLowerCase();

    const routeColor = routeToHexColor.get(route) ?? "#888";

    return (
        <HolidaySection title="Holiday Train">
            <HolidayCard
                heading={`${sortedData[0].destinationName}-bound ${titleCaseRoute} Line`}
                meta={`Run ${run}`}
                headerColor={routeColor}
                headerTextColor={route === "YELLOW" ? "#000" : "#fff"}
                columnLabel="Upcoming stations"
                itemNoun="stations"
                rows={sortedData.map((arrival) => ({
                    key: JSON.stringify(arrival),
                    name: arrival.stationName,
                    etaMinutes: arrival.etaMinutes,
                    approaching: arrival.approaching,
                    scheduled: arrival.scheduled,
                    delayed: arrival.delayed,
                }))}
                updatedAt={dataUpdatedAt}
                isFetching={isFetching}
            />
        </HolidaySection>
    );
}

export default HolidayTrain;
