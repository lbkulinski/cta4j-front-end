import LogRocket from 'logrocket';
// @ts-ignore
import setupLogRocketReact from 'logrocket-react';

LogRocket.init(import.meta.env.VITE_LOGROCKET_APP_ID);

setupLogRocketReact(LogRocket);
