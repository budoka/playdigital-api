import { IExternalAPI } from './interface';
import { getVar } from 'src/utils/enviroment';

export const externalApis: IExternalAPI[] = [
  {
    name: 'bravenewcoin',
    domain: `https://${getVar('RAPID_API_HOST')}`,
    paths: [
      {
        methodName: 'GetToken',
        verb: 'POST',
        path: 'oauth/token',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': getVar('RAPID_API_HOST'),
          'x-rapidapi-key': getVar('RAPID_API_KEY'),
          accept: 'application/json',
          useQueryString: true,
        },
        data: {
          audience: 'https://api.bravenewcoin.com',
          client_id: 'oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY',
          grant_type: 'client_credentials',
        },
      },
      {
        methodName: 'Market',
        verb: 'GET',
        path: 'market',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': getVar('RAPID_API_HOST'),
          'x-rapidapi-key': getVar('RAPID_API_KEY'),
          useQueryString: true,
        },
      },
      {
        methodName: 'AssetTicker',
        verb: 'GET',
        path: 'market-cap',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': getVar('RAPID_API_HOST'),
          'x-rapidapi-key': getVar('RAPID_API_KEY'),
          useQueryString: true,
        },
      },
      {
        methodName: 'Asset',
        verb: 'GET',
        path: 'asset',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': getVar('RAPID_API_HOST'),
          'x-rapidapi-key': getVar('RAPID_API_KEY'),
          useQueryString: true,
        },
      },
    ],
  },
];
