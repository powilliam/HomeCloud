import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { readdirSync, unlinkSync } from 'fs';
import { resolve } from 'path';

import { File } from '../database/entities/File';

class StorageManager {
  public async destroy(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { fileId } = request.params;

    const fileRepository = getRepository(File);

    const file = await fileRepository.findOne({
      where: { id: fileId },
    });

    const storagedFile = file?.accessUrl.split('storage')[1].split('/')[1];

    const storageDir = resolve(__dirname, '..', '..', 'public', 'storage');

    readdirSync(storageDir).forEach(
      file =>
        file === storagedFile && unlinkSync(storageDir + '/' + storagedFile)
    );

    next();
  }
}

export default new StorageManager();
