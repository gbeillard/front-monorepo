import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const CONFIG = {
  dev: {
    dsn: 'https://47869bf546ca466aa00b7f4c6104b22a@o1081477.ingest.sentry.io/6154600',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
  },
  preprod: {
    dsn: 'https://0da337b8530d44a8a9d9d1167fa6d9da@o1081477.ingest.sentry.io/6154459',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
  },
  prodrc: {
    dsn: 'https://e12224fdd69844e196b1bcaa472be6b3@o1081477.ingest.sentry.io/6154459',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
  },
  prod: {
    dsn: 'https://93bcad37d90b42e9ac6c2b4a48038c05@o1081477.ingest.sentry.io/6154594',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.05,
  },
};

const ignoreErrors = [
  // Disconnection
  'Failed to fetch',
  // Untracked errors
  't.onMouseEnterTableRowVariant',
  't.onMouseLeaveTableRowVariant',
];

const getEnvironmentConfig = () => {
  const environment = `${process.env.NODE_ENV}-${process.env.TARGET_ENV}`;
  switch (environment) {
    case 'development-preprod':
    case 'development-dev':
    case 'development-test':
      return CONFIG.dev;
    case 'production-preprod':
      return CONFIG.preprod;
    case 'production-prodrc':
      return CONFIG.prodrc;
    case 'production-prod':
      return CONFIG.prod;
    default:
      return null;
  }
};

export const initSentry = () => {
  const config = getEnvironmentConfig();
  if (config) {
    const commonConfig = {
      ignoreErrors,
    };

    Sentry.init({
      ...config,
      ...commonConfig,
    });
  }
};