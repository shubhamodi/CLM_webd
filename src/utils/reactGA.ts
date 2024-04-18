import ReactGA from 'react-ga'

const GA_MEASUREMENT_ID="G-P2M61WYZ4S";

ReactGA.initialize('G-P2M61WYZ4S');
export const initGA = () => {
    ReactGA.initialize('G-P2M61WYZ4S');
  };
  
  export const logPageView = () => {
    // console.log(`Logging pageview for ${window.location.pathname}`);
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  };
  
  export const logEvent = (category = '', action = '') => {
    if (category && action) {
      ReactGA.event({ category, action });
    }
  };
  
  export const logException = (description = '', fatal = false) => {
    if (description) {
      ReactGA.exception({ description, fatal });
    }
  };
  
  // export const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
   
  export const pageview = () => {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  };
   
  export const event = ({ action, category, label, value }) => {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  };