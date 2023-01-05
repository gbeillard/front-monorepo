import { useEffect } from 'react';
import { Location, useLocation } from 'react-router-dom';

/**
 * Accepts a function that contains imperative, possibly effectful code, trigger on every location change.
 *
 * @param effect Imperative function that can return a cleanup function and have current location as argument
 *
 * @example
 *
 *
 * export const Component = () => {
 *   useLocationEffect((location) => {
 *       console.log('i update every location change: ', location);
 *  });
 *
 *   ...
 * }
 */
const useLocationEffect = (effect: (location: Location) => (void | (() => void))) => {
  const location = useLocation();

  useEffect(() => effect(location), [location, effect]);
};

export default useLocationEffect;