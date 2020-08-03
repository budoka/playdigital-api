export interface IExternalAPI {
  name: string;
  domain: string;
  paths: IPath[];
}

export interface IPath {
  methodName: string;
  verb: 'GET' | 'POST';
  path: string;
  headers?: {
    [header: string]: unknown;
  };
  data?: {
    [data: string]: unknown;
  };
  params?: {
    [data: string]: unknown;
  };
}

export interface IExternalAPIToken {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

export interface IRawDataAsset {
  id: string;
  name: string;
  symbol: string;
  status: string;
  type: string;
  url: string;
}

export interface IRawDataMarket {
  id: string;
  assetId: string;
  marketCapRank: number;
  price: number;
}

export interface ICryptocurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  url: string;
}
