import { IExternalAPI } from './interface';

export const externalApis: IExternalAPI[] = [
  {
    name: 'bravenewcoin',
    domain: 'https://bravenewcoin.p.rapidapi.com',
    paths: [
      {
        methodName: 'GetToken',
        verb: 'POST',
        path: 'oauth/token',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': 'bb61f90a8fmsh7105b10221edb33p1ae5c3jsn338e62640f9e',
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
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': 'bb61f90a8fmsh7105b10221edb33p1ae5c3jsn338e62640f9e',
          useQueryString: true,
        },
      },
      {
        methodName: 'AssetTicker',
        verb: 'GET',
        path: 'market-cap',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': 'bb61f90a8fmsh7105b10221edb33p1ae5c3jsn338e62640f9e',
          useQueryString: true,
        },
      },
      {
        methodName: 'Asset',
        verb: 'GET',
        path: 'asset',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
          'x-rapidapi-key': 'bb61f90a8fmsh7105b10221edb33p1ae5c3jsn338e62640f9e',
          useQueryString: true,
        },
      },
    ],
  },
];
