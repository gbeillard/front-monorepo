import { Location } from 'react-router-dom';
import { getLocationFrom } from './location';

const TEST = 'TEST';

describe('getLocationFrom', () => {
  it('should return undefined when state is broken', () => {
    expect(getLocationFrom({} as Location)).toBeUndefined();
    expect(getLocationFrom({ state: null } as Location)).toBeUndefined();
    expect(getLocationFrom({ state: { from: 123 } } as Location)).toBeUndefined();
  });
  it('should return pathname when state is complete', () => {
    expect(getLocationFrom({ state: { from: { pathname: TEST } } } as Location)).toBe(TEST);
  });
});