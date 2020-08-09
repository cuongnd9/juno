import { diana } from 'diana-js';
import { logger, globalOptions } from '../src';

globalOptions.environment = 'production';

it('test', async() => {
  expect(typeof logger).toEqual('function');
  expect(typeof logger()).toEqual('object');
  logger().info('id', diana());
});
