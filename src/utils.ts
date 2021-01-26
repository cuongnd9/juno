import { flatten } from 'lodash';

import { Options } from './types';

const formatRest = (options: Options) => (...rest: any[]) => {
  const flattenRest = flatten(rest);
  flattenRest.forEach((element, index) => {
    if (element instanceof Error) {
      flattenRest.splice(index, 1);
      flattenRest.push(`${element.name}: ${element.message}`);
      if (options.environment === 'development') {
        flattenRest.push(element.stack);
      }
    }
  });
  return flattenRest;
};

export { formatRest };
