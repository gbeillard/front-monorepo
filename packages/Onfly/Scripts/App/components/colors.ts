const getCssFromRgba = (color: { r: any; g: any; b: any }, alpha) =>
  getCssFromRgb(getRgbFromRgba(color, alpha));
const getCssFromRgb = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;
const getRgbFromRgba = ({ r, g, b }, a) => ({
  r: (1 - a) * 255 + r * a,
  g: (1 - a) * 255 + g * a,
  b: (1 - a) * 255 + b * a,
});

const BASE_COLORS = {
  PRIMARY: { r: 15, g: 32, b: 115 }, // BLEU MER
  SECONDARY: { r: 0, g: 117, b: 246 }, // BLEU CIEL
  TERTIARY: { r: 255, g: 206, b: 118 }, // JAUNE
  EMPTY: { r: 255, g: 255, b: 255 }, // BLANC
  NEUTRAL: { r: 11, g: 16, b: 59 }, // NEUTRE
  SUCCESS: { r: 63, g: 167, b: 80 }, // SUCCES
  ERROR: { r: 240, g: 61, b: 62 }, // ERREUR
};

export const NEUTRAL = {
  100: '#0B103B',
  90: '#21254C', // added by NiM
  80: '#23284E',
  70: '#42526E',
  60: '#68758B',
  50: '#8E97A8',
  40: '#B3BAC5',
  30: '#D9DCE2',
  20: '#ECEEF0',
  10: '#F9FAFC',
  5: '#F9FAFC',
};

const COLORS = {
  PRIMARY: '#0F2073',
  P90: '#273681',
  P70: '#57639D',
  P60: '#6F79AB',
  P50: '#878FB9',
  P40: '#9FA6C7',
  P30: '#B7BCD5',
  P20: '#CFD2E3',
  P10: '#E7E9F1',
  P05: '#F3F4F8',
  SECONDARY: '#0075F6',
  SE90: '#1A83F7',
  SE70: '#4D9EF9',
  SE60: '#66ACFA',
  SE50: '#80BAFA',
  SE40: '#99C8FB',
  SE30: '#B3D6FC',
  SE20: '#CCE3FD',
  SE10: '#E6F1FE',
  SE05: '#F2F8FF',
  TERTIARY: '#FFCE76',
  T90: '#FFD384',
  T70: '#FFDD9F',
  T60: '#FFE2AD',
  T50: '#FFE6BA',
  T40: '#FFEBC8',
  T30: '#FFF0D6',
  T20: '#FFF5E4',
  T10: '#FFFAF1',
  T05: '#FFFDF8',
  NEUTRAL: '#0B103B',
  N90: getCssFromRgba(BASE_COLORS.NEUTRAL, 0.9), // ?
  N80: '#23284E',
  N70: '#42526E',
  N60: '#68758B',
  N50: '#8E97A8',
  N40: '#B3BAC5',
  N30: '#D9DCE2',
  N20: '#ECEEF0',
  N10: '#F9FAFC',
  N05: getCssFromRgba(BASE_COLORS.NEUTRAL, 0.05), // ?
  SUCCESS: '#3FA750',
  SU90: '#52AF62',
  SU70: '#79C185',
  SU60: '#8CCA96',
  SU50: '#9FD3A8',
  SU40: '#B2DCB9',
  SU30: '#C5E5CB',
  SU20: '#D9EDDC',
  SU10: '#ECF6EE',
  SU05: '#F5FBF6',
  ERROR: '#F03D3E',
  ER90: '#F15051',
  ER70: '#F57778',
  ER60: '#F68B8B',
  ER50: '#F79E9E',
  ER40: '#F9B1B2',
  ER30: '#FBC5C5',
  ER20: '#FCD8D8',
  ER10: '#FEECEC',
  ER05: '#FEF5F5',
  EMPTY: '#FFFFFF',
};

export default COLORS;