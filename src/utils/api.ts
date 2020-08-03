import _ from 'lodash';
import { ExternalAPIError } from 'src/exceptions';
import { externalApis } from 'src/services/constants';

/**
 * Get the data of an API from an array of APIs.
 * @param apiName API name.
 * @param methodName Method/path name.
 */
export function getExternaAPIData(apiName: string, methodName: string) {
  const api = _.find(externalApis, (api) => api.name === apiName);

  if (!api) throw new ExternalAPIError(`API '${apiName}' not found.`);

  const domain = api.domain;
  const path = _.find(api.paths, (path) => path.methodName === methodName);

  if (!path) throw new ExternalAPIError(`Method name: '${methodName}' not found.`);

  return { domain, path };
}
