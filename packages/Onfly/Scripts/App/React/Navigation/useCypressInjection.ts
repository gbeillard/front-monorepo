import { useEffect } from 'react';

declare global {
  interface Window {
    cyRoutes: any;
    Cypress: any;
  }
}

export const useCypressInjection = (key: string, data: any) => {
  useEffect(() => {
    if (window.Cypress) {
      window[key] = JSON.stringify(data);
    }
  }, []);
};