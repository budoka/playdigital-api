import express from 'express';
import _ from 'lodash';
import { Get, JsonController, Param, QueryParam, Res, Req, NotFoundError } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Sort } from 'src/constants/enums';
import Cryptocurrency from 'src/models/entities/cryptocurrency.entity';
import { ExternalAPIError } from 'src/exceptions';
import { getAsset, getAssetTicker, getTokenFromBraveNewCoin } from 'src/services';
import { ICryptocurrency, IExternalAPIToken, IRawDataAsset, IRawDataMarket } from 'src/services/interface';
import { getVar } from 'src/utils/enviroment';
import { compare } from 'src/utils/string';
import { getConnectionManager, Repository } from 'typeorm';
import { Authorize } from 'src/auth/decorators/authorize';

const database = getVar('DATABASE_NAME');

@JsonController('/cryptocurrencies')
export class CryptocurrencyController {
  private cryptocurrencyRepository: Repository<Cryptocurrency>;
  private token: IExternalAPIToken | null;

  constructor() {
    this.cryptocurrencyRepository = getConnectionManager().get(database).getRepository(Cryptocurrency);
  }

  async getToken() {
    if (!this.token) this.token = await getTokenFromBraveNewCoin();
    return this.token;
  }

  @OpenAPI({
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'sortByPrice', in: 'query', schema: { type: 'string', enum: [Sort.ASC, Sort.DESC] } }],
  })
  @Authorize()
  @Get()
  async getAll(@Req() req: express.Request, @Res() res: express.Response, @QueryParam('sortByPrice') sortByPrice: string) {
    // Get all cryptocurrencies
    const status = 'ACTIVE';
    const type = 'CRYPTO';

    // Get first rawdata (assets)
    const assets: IRawDataAsset[] = await getAsset({ status, type });

    const cryptocurrenciesAsset = assets.map((asset) => {
      const { id, name, symbol, url } = asset;
      return { id, name, symbol, url };
    });

    // Get second rawdata (market)
    const token = await this.getToken();

    if (!token) throw new ExternalAPIError('Token is empty.');
    if (token.expires_in <= 0) throw new ExternalAPIError('Token is expired.');

    let market: IRawDataMarket[] = await getAssetTicker(token.access_token);

    const cryptocurrenciesMarket = market.map((market) => {
      const { assetId, price } = market;
      return { id: assetId, price };
    });

    // Merge data
    const mergedData: ICryptocurrency[] = _(cryptocurrenciesAsset)
      .keyBy('id')
      .merge(_.keyBy(cryptocurrenciesMarket, 'id'))
      .values()
      .value();

    // Sort by price
    const sortedData = mergedData.sort((a, b) => {
      return compare(a.price, b.price, sortByPrice == Sort.ASC ? false : true);
    });

    return res.status(200).send(sortedData);
  }

  @Get('/assets')
  async getAssets(@Res() res: express.Response) {
    // Get all actived cryptocurrencies
    const status = 'ACTIVE';
    const type = 'CRYPTO';

    // Get rawdata
    const rawdata: IRawDataAsset[] = await getAsset({ status, type });

    return res.status(200).send(rawdata);
  }

  @Get('/marketcap')
  async getMarketCap(
    @Res() res: express.Response,
    @QueryParam('assetId') assetId: string,
    @QueryParam('percentChange') percentChange: number,
  ) {
    // Get rawdata (market)
    const token = await this.getToken();

    if (!token) throw new ExternalAPIError('Token is empty.');
    if (token.expires_in <= 0) throw new ExternalAPIError('Token is expired.');

    let rawdata: IRawDataMarket[] = await getAssetTicker(token.access_token);

    return res.status(200).send(rawdata);
  }

  /*@Get('/:symbol')
  async getOne(@Param('symbol') symbol: string, @Res() res: express.Response) {
    return this.cryptocurrencyRepository.findOne({ symbol }).then((cryptocurrency) => {
      if (!cryptocurrency) throw new NotFoundError(`Cryptocurrency doesn't exist.`);
      return res.status(200).send(cryptocurrency);
    });
  }*/
}
