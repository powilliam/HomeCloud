import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Folder } from '../database/entities/Folder';

class FolderController {
  public async index(request: Request, response: Response) {
    const folderRepository = getRepository(Folder);

    const folders = await folderRepository.find({ relations: ['files'] });

    return response.json({ folders });
  }

  public async store(request: Request, response: Response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({
        error: 'missing required information',
      });
    }

    const folderRepository = getRepository(Folder);

    const accessCode = randomBytes(4).toString('hex');
    const folder = folderRepository.create({ name, accessCode });
    await folderRepository.save(folder);

    return response.json(folder);
  }

  public async destroy(request: Request, response: Response) {
    const { folderId } = request.params;

    const folderRepository = getRepository(Folder);

    const isCreated = await folderRepository.findOne({
      where: { id: folderId },
    });

    if (!isCreated) {
      return response.status(400).json({
        error: 'cannot delete a folder that doesnt exist',
      });
    }

    await folderRepository.delete({ id: isCreated.id });

    return response.status(204).json({});
  }
}

export default new FolderController();
