import { ConnectionOptions } from 'typeorm';

import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } from './env';

import { CreateFolder1587684430506 as CreateFolder } from '../database/migrations/1587684430506-CreateFolder';
import { CreateFile1587684843460 as CreateFile } from '../database/migrations/1587684843460-CreateFile';
import { CreateFolderFileRelation1587685364109 as CreateFolderFileRelation } from '../database/migrations/1587685364109-CreateFolderFileRelation';

import { Folder } from '../database/entities/Folder';
import { File } from '../database/entities/File';

export const development: ConnectionOptions = {
  type: 'postgres',
  username: 'dev',
  password: 'dev',
  database: 'dev',
  host: 'localhost',
  port: 3334,
  entities: [Folder, File],
  migrations: [CreateFolder, CreateFile, CreateFolderFileRelation],
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
  entities: [Folder, File],
  migrations: [CreateFolder, CreateFile, CreateFolderFileRelation],
  synchronize: false,
  migrationsRun: true,
  logging: false,
};
