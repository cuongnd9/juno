import { createLogger, transports, format } from 'winston';
import { flatten } from 'lodash';

type Level = 'error' | 'warn' | 'info';
type DefaultMeta = {
  layer: string;
  component: string;
  fileName: string;
};
type Options = {
  environment?: string;
};

const globalOptions: Options = {
  environment: 'development',
};

const getLogger = (level: Level = 'info', defaultMeta?: DefaultMeta) => {
  const { Console } = transports;
  const {
    combine, timestamp, json, splat, errors,
  } = format;
  const logger = createLogger({
    level,
    format: combine(
      errors({ stack: true }),
      splat(),
      timestamp(),
      json(),
    ),
    defaultMeta,
    transports: [
      new Console(),
    ],
  });
  return logger;
};

const formatRest = (...rest: any[]) => {
  const flattenRest = flatten(rest);
  flattenRest.forEach((element, index) => {
    if (element instanceof Error) {
      flattenRest.splice(index, 1);
      flattenRest.push(`${element.name}: ${element.message}`);
      if (globalOptions.environment === 'development') {
        flattenRest.push(element.stack);
      }
    }
  });
  return flattenRest;
};

/**
 * Create a logger instance with 3 levels: error, warn and info.
 *
 * @param {object} rest anything you want to log
 * defaultMeta Metadata can be the current path, component, group, service, layer, etc.
 * defaultMeta must be the last parameter */
const logger = ({
  error: (...rest: any | keyof DefaultMeta[]) => {
    const lastParams = rest[rest.length - 1];
    if (lastParams.layer || lastParams.component || lastParams.fileName) {
      getLogger('error', lastParams).error(formatRest(rest.slice(0, rest.length - 1)));
    } else {
      getLogger('error').error(formatRest(rest));
    }
  },
  warn: (...rest: any | keyof DefaultMeta[]) => {
    const lastParams = rest[rest.length - 1];
    if (lastParams.layer || lastParams.component || lastParams.fileName) {
      getLogger('warn', lastParams).warn(formatRest(rest.slice(0, rest.length - 1)));
    } else {
      getLogger('warn').warn(formatRest(rest));
    }
  },
  info: (...rest: any | keyof DefaultMeta[]) => {
    const lastParams = rest[rest.length - 1];
    if (lastParams.layer || lastParams.component || lastParams.fileName) {
      getLogger('info', lastParams).info(formatRest(rest.slice(0, rest.length - 1)));
    } else {
      getLogger('info').info(formatRest(rest));
    }
  },
});

export { logger, globalOptions, DefaultMeta };
