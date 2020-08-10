import { diana } from 'diana-js';
import { logger, globalOptions } from '../src';

globalOptions.environment = 'production';

it('test', async() => {
  expect(typeof logger).toEqual('object');
  expect(typeof logger.info).toEqual('function');
  logger.info('id', diana());
  logger.info('id', diana(), { layer: '__tests__' });
});
