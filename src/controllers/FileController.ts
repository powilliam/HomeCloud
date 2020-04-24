import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { File } from '../database/entities/File';

import { HTTP_ADDRESS, HTTP_STATICFOLDER } from '../config/env';

class FileController {
  public async store(request: Request, response: Response) {
    if (!request.file) {
      return response
        .status(400)
        .json({ error: 'cannot upload a file that wasnt attached' });
    }

    const { filename, originalname, size, mimetype } = request.file;
    const fileRepository = getRepository(File);

    const [name] = originalname.split('.');
    const accessUrl = `${HTTP_ADDRESS}${HTTP_STATICFOLDER}/${filename}`;

    const file = fileRepository.create({
      name,
      size,
      accessUrl,
      mimetype,
    });

    await fileRepository.save(file);

    return response.status(201).json(file);
  }

  public async destroy(request: Request, response: Response) {
    const { fileId } = request.params;

    const fileRepository = getRepository(File);

    const isUploaded = await fileRepository.findOne({ where: { id: fileId } });

    if (!isUploaded) {
      return response
        .status(406)
        .json({ error: 'cannot delete a file that doesnt exist' });
    }

    await fileRepository.delete({ id: isUploaded.id });
    return response.status(204).json({});
  }
}

export default new FileController();
