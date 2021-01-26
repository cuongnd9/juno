import { createLogger, transports, format } from 'winston';
import { get } from 'lodash';

import { formatRest } from './utils';
import { Logger, Level, DefaultMeta, Options } from './types';

/* eslint-disable prefer-const */
let globalOptions: Options = {
  environment: 'development',
};
const JUNO_LEVELS: Level[] = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

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

/**
 * Create a logger instance with 3 levels: error, warn and info.
 *
 * @param {object} rest anything you want to log
 * defaultMeta Metadata can be the current path, component, group, service, layer, etc.
 * defaultMeta must be the last parameter */
const logger: Logger = JUNO_LEVELS
  .reduce((obj: any, level: Level) => ({
    ...obj,
    [level]: (...rest: any | keyof DefaultMeta) => {
      if (rest.length === 0) {
        throw new Error('Please provide parameter');
      }
      const lastParam = rest[rest.length - 1];
      const existedLastParam = get(lastParam, 'layer') || get(lastParam, 'component') || get(lastParam, 'fileName');
      if (existedLastParam) {
        const formattedParam = formatRest(globalOptions)(rest.slice(0, rest.length - 1));
        getLogger(level, lastParam)[level](formattedParam);
      } else {
        const formattedParam = formatRest(globalOptions)(rest);
        getLogger(level)[level](formattedParam);
      }
    },
  }), {});

export { logger, globalOptions, DefaultMeta, Logger, Level, Options };
