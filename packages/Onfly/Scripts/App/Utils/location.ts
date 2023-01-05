import { Location } from 'react-router-dom';

export const getLocationFrom = ({ state }: Location): string | undefined => (state as any)?.from?.pathname as string;