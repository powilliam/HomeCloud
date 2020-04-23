import { ConnectionOptions } from 'typeorm';

import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } from './env';

export const development: ConnectionOptions = {
  type: 'postgres',
  username: 'dev',
  password: 'dev',
  database: 'dev',
  host: 'localhost',
  port: 3334,
  entities: [],
  migrations: [],
  synchronize: true,
  migrationsRun: true,
  logging: true,
};

export const production: ConnectionOptions = {
  type: 'postgres',
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  host: 'localhost',
  port: 5432,
  entities: [],
  migrations: [],
  synchronize: false,
  migrationsRun: true,
  logging: false,
};
