import { validate } from 'class-validator';
import express from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { QueryError } from 'mysql2';
import {
  BadRequestError,
  Delete,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  Res,
  UnauthorizedError,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ConflictError, UnprocessableEntityError } from 'src/exceptions';
import User from 'src/models/entities/user.entity';
import { UserLogin } from 'src/models/schemas';
import { hashPassword, verifyPassword } from 'src/utils/crypto';
import { getConstraintErrorMessage } from 'src/utils/database';
import { getVar } from 'src/utils/enviroment';
import { getConnectionManager, Repository } from 'typeorm';
import { EntityFromBody } from 'typeorm-routing-controllers-extensions';

const database = getVar('DATABASE_NAME');
const BodyToEntity = () => EntityFromBody({ connection: database });

@JsonController('/users')
export class UserController {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getConnectionManager().get(database).getRepository(User);
  }

  @Get()
  async getAll(@Res() res: express.Response) {
    return this.userRepository.find();
  }

  @OpenAPI({
    // security: [{ bearerAuth: [] }],
  })
  @Post()
  async add(@BodyToEntity() user: User, @Res() res: express.Response) {
    const { password } = user;

    return validate(user).then((errors) => {
      if (errors.length > 0) {
        throw new UnprocessableEntityError(_.values(errors[0].constraints)[0]);
      } else {
        // If has valid data, generate the hash and salt from password
        const { hash, salt } = hashPassword(password);
        user.password = hash;
        user.salt = salt;
        // Save the user
        return this.userRepository.save(user).catch((error: QueryError) => {
          if (error.errno === 1062) throw new ConflictError('User already exist.');
          else if (error.errno === 1364) throw new BadRequestError('Invalid user.');
          else if (error.errno === 1452) throw new UnprocessableEntityError(getConstraintErrorMessage(error.message));
        });
      }
    });
  }

  @Get('/:username')
  async getOne(@Param('username') username: string, @Res() res: express.Response) {
    return this.userRepository.findOne({ username }).then((user) => {
      if (!user) throw new NotFoundError(`User doesn't exist.`);
      return res.status(200).send(user);
    });
  }

  @Put('/:username')
  async update(@Param('username') username: string, @BodyToEntity() user: User, @Res() res: express.Response) {
    const { password } = user;

    return validate(user).then((errors) => {
      if (errors.length > 0) {
        throw new UnprocessableEntityError(_.values(errors[0].constraints)[0]);
      } else {
        // If has valid data, generate the hash and salt from password
        const { hash, salt } = hashPassword(password);
        user.password = hash;
        user.salt = salt;
        // Save the user
        return this.userRepository.update({ username }, user).then((result) => {
          if (result.affected === 0) throw new NotFoundError(`User doesn't exist.`);
          else if (result.affected === 1) return res.status(200).send(user);
          else throw new InternalServerError('An unexpected error happened when an user was updated');
        });
      }
    });
  }

  @Delete('/:username')
  async remove(@Param('username') username: string, @Res() res: express.Response) {
    return this.userRepository.delete({ username }).then((result) => {
      if (result.affected === 0) throw new NotFoundError(`User doesn't exist.`);
      else if (result.affected === 1) return res.status(200).send(`User removed.`);
      else throw new InternalServerError('An unexpected error happened when an user was deleted');
    });
  }

  @OpenAPI({
    requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/' + UserLogin.name } } } },
  })
  @Post('/login')
  async login(@Res() res: express.Response, @BodyToEntity() user: User) {
    const { username, password } = user;

    try {
      // Check username and password
      if (!username || !password) throw new UnauthorizedError();

      const foundUser = await this.userRepository.findOne({ username });

      // Check user in database
      if (!foundUser) throw new UnauthorizedError();

      const { id, password: hashPassword, salt, currency } = foundUser;

      if (verifyPassword(hashPassword, salt, password)) {
        // Define payload data
        const payload = { id, username, currency: currency.symbol };

        // Retrieve data from environment
        const secretKey = getVar('JWT_SECRET_KEY');
        const issuer = getVar('JWT_ISSUER');
        const expiresIn = getVar('JWT_EXPIRE_TIME');

        const token = jwt.sign(payload, secretKey, {
          issuer,
          expiresIn,
        });

        return res.status(200).send({ token });
      } else {
        throw new UnauthorizedError();
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) throw new UnauthorizedError('Invalid username or password.');
      else throw error;
    }
  }
}
