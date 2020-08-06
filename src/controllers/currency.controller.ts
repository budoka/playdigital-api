import express from 'express';
import { Get, JsonController, NotFoundError, Param, Req, Res } from 'routing-controllers';
import Currency from 'src/models/entities/currency.entity';
import { getVar } from 'src/utils/enviroment';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromBody } from 'typeorm-routing-controllers-extensions';

const database = getVar('DATABASE_NAME');
const BodyToEntity = () => EntityFromBody({ connection: database });

@JsonController('/currencies')
export class CurrencyController {
  private currencyRepository: Repository<Currency>;

  constructor() {
    this.currencyRepository = getConnectionManager().get(database).getRepository(Currency);
  }

  @Get()
  async getAll(@Req() req: express.Request, @Res() res: express.Response) {
    return this.currencyRepository.find();
  }

  @Get('/:symbol')
  async getOne(@Param('symbol') symbol: string, @Res() res: express.Response) {
    return this.currencyRepository.findOne({ symbol }).then((currency) => {
      if (!currency) return res.status(404).send(new NotFoundError(`Currency doesn't exist.`));
      return res.status(200).send(currency);
    });
  }
}
