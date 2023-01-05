import { useEffect } from 'react';

type EffectCallback = (visibilityState: 'hidden' | 'visible' | 'prerender') => (() => void) | void;

export const useFocusEffect = (callback: EffectCallback) => {
  useEffect(() => {
    const handleVisibilityChange = () => callback(document.visibilityState);

    const unmount = handleVisibilityChange();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      unmount instanceof Function && unmount?.();
    };
  }, []);
};