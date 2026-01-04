import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-FYYMR0E0KW';

export const initGA = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        console.log('GA initialized');
    } else {
        console.warn('GA_MEASUREMENT_ID is missing in environment variables. Analytics will not be tracked.');
    }
};

export const logPageView = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
};

export const logEvent = (category, action, label) => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.event({
            category,
            action,
            label,
        });
    }
};
