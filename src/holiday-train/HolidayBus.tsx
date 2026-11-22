import {useRollbar} from "@rollbar/react";
import {UpcomingBusArrival, useGetBus} from "../api";
import {AxiosError, isAxiosError} from "axios";
import {HolidayCard, HolidayEmpty, HolidayMessage, HolidaySection} from "./HolidaySection.tsx";

function compareArrivals(arrival0: UpcomingBusArrival, arrival1: UpcomingBusArrival) {
    return new Date(arrival0.arrivalTime).getTime() - new Date(arrival1.arrivalTime).getTime();
}

const notRunning = (
    <HolidaySection title="Holiday Bus">
        <HolidayEmpty vehicle="Bus"/>
    </HolidaySection>
);

function HolidayBus() {
    const id = "4374";

    const rollbar = useRollbar();

    const { data, isLoading, isFetching, dataUpdatedAt, error } = useGetBus(
        id,
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
            <HolidaySection title="Holiday Bus">
                <HolidayMessage>
                    An error occurred while retrieving the Holiday Bus data. Please check back later.
                </HolidayMessage>
            </HolidaySection>
        );
    }

    const bus = data?.data ?? null;

    if (bus === null || !Array.isArray(bus.arrivals) || bus.arrivals.length === 0) {
        return notRunning;
    }

    const sortedData = [...bus.arrivals].sort(compareArrivals);

    return (
        <HolidaySection title="Holiday Bus">
            <HolidayCard
                heading={`${sortedData[0].destination}-bound Route ${sortedData[0].route}`}
                meta={`VID ${id}`}
                headerColor="#58595b"
                columnLabel="Upcoming stops"
                itemNoun="stops"
                rows={sortedData.map((arrival) => ({
                    key: JSON.stringify(arrival),
                    name: arrival.stopName,
                    etaMinutes: arrival.etaMinutes,
                    delayed: arrival.delayed,
                }))}
                updatedAt={dataUpdatedAt}
                isFetching={isFetching}
            />
        </HolidaySection>
    );
}

export default HolidayBus;
