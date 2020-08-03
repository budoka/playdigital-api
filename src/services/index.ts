import axios, { AxiosRequestConfig } from 'axios';
import { getVar } from 'src/utils/enviroment';
import { ObjectLiteral } from 'typeorm';
import { externalApis } from './constants';
import _ from 'lodash';
import { ExternalAPIError } from 'src/exceptions';
import { getExternaAPIData } from 'src/utils/api';
import logger, { Levels } from 'src/logger';

export interface QueryParams {
  select?: string[];
  where?: ObjectLiteral;
  offset?: number;
  limit?: number;
  order?: { [P in keyof any]?: 'ASC' | 'DESC' };
}

export const getTokenFromBraveNewCoin = async () => {
  logger.log({ level: Levels.Info, message: `Getting new token.` });

  const apiName = 'bravenewcoin';
  const methodName = 'GetToken';

  const api = getExternaAPIData(apiName, methodName);

  const { domain } = api;
  const { verb, path, headers, data } = api.path;

  const endpoint = `${domain}/${path}`;

  return await axios({
    method: verb,
    url: endpoint,
    headers,
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new ExternalAPIError('Unabled to get token.');
    });
};

export const getMarket = async () => {
  const apiName = 'bravenewcoin';
  const methodName = 'Market';

  const api = getExternaAPIData(apiName, methodName);

  const { domain } = api;
  const { verb, path, headers, params } = api.path;

  const endpoint = `${domain}/${path}`;

  return await axios({
    method: verb,
    url: endpoint,
    headers,
    params,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new ExternalAPIError('Unabled to get token.');
    });
};

export const getAssetTicker = async (token: string, params?: ObjectLiteral) => {
  const apiName = 'bravenewcoin';
  const methodName = 'AssetTicker';

  const api = getExternaAPIData(apiName, methodName);

  const { domain } = api;
  const { verb, path } = api.path;
  let { headers } = api.path;

  headers = { ...headers, Authorization: `Bearer ${token}` };

  const endpoint = `${domain}/${path}`;

  return await axios({
    method: verb,
    url: endpoint,
    headers,
    params,
  })
    .then((response) => response.data.content)
    .catch((error) => {
      throw new ExternalAPIError('Unabled to get asset ticker.');
    });
};

export const getAsset = async (params?: ObjectLiteral) => {
  const apiName = 'bravenewcoin';
  const methodName = 'Asset';
  const api = getExternaAPIData(apiName, methodName);

  const { domain } = api;
  const { verb, path, headers } = api.path;

  const endpoint = `${domain}/${path}`;

  return await axios({
    method: verb,
    url: endpoint,
    headers,
    params,
  })
    .then((response) => response.data.content)
    .catch((error) => {
      throw new ExternalAPIError('Unabled to get asset.');
    });
};
