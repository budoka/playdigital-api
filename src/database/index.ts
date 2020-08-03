import path from 'path';
import { getVar, isDatabaseLogEnabled, isDevelopment } from 'src/utils/enviroment';
import { createConnections } from 'typeorm';

export const getConnections = () =>
  createConnections([
    {
      type: 'mysql',
      name: getVar('DATABASE_NAME'),
      host: getVar('DATABASE_HOST'),
      port: Number(getVar('DATABASE_PORT')),
      username: getVar('DATABASE_USER'),
      password: getVar('DATABASE_PASSWORD'),
      database: getVar('DATABASE_NAME'),
      entities: [path.join(__dirname, '../models/entities/*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
      dropSchema: isDevelopment(),
      synchronize: isDevelopment(),
      migrationsRun: isDevelopment(),
      logging: isDatabaseLogEnabled(),
      multipleStatements: false,
    },
  ]);
