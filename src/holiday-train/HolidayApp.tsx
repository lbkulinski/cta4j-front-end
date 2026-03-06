import HolidayBus from "./HolidayBus.tsx";
import HolidayTrain from './HolidayTrain.tsx';
import useDocumentMetadata from "../useDocumentMetadata.ts";

function HolidayApp() {
    useDocumentMetadata('cta4j — CTA Holiday Train Tracker', 'https://cta4j.com/holiday-train');

    return (
        <div>
            <HolidayTrain />
            <HolidayBus />
        </div>
    );
}

export default HolidayApp;
