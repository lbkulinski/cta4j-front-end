import React from 'react';
import HolidayBus from "./HolidayBus.tsx";
import HolidayTrain from './HolidayTrain.tsx';

function HolidayApp() {
    React.useEffect(() => {
        const prevTitle = document.title;
        document.title = 'cta4j — CTA Holiday Train Tracker';
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const prevCanonical = canonical?.getAttribute('href') ?? '';
        canonical?.setAttribute('href', 'https://cta4j.com/holiday-train');
        return () => {
            document.title = prevTitle;
            canonical?.setAttribute('href', prevCanonical);
        };
    }, []);

    return (
        <div>
            <HolidayTrain />
            <HolidayBus />
        </div>
    );
}

export default HolidayApp;
