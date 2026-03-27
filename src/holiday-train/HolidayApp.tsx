import HolidayBus from "./HolidayBus.tsx";
import HolidayTrain from './HolidayTrain.tsx';
import useDocumentMetadata from "../useDocumentMetadata.ts";

function HolidayApp() {
    useDocumentMetadata('cta4j — Holiday Train', 'https://cta4j.com/holiday');
    return (
        <div>
            <HolidayTrain />
            <HolidayBus />
        </div>
    );
}

export default HolidayApp;
