import HolidayBus from "./HolidayBus.tsx";
import HolidayTrain from './HolidayTrain.tsx';
import Snow from "./Snow.tsx";
import useDocumentMetadata from "../useDocumentMetadata.ts";

function HolidayApp() {
    useDocumentMetadata('cta4j — Holiday Train', 'https://cta4j.com/holiday');
    return (
        <div style={{position: 'relative'}}>
            <Snow />
            <div style={{position: 'relative', zIndex: 1}}>
                <HolidayTrain />
                <HolidayBus />
            </div>
        </div>
    );
}

export default HolidayApp;
