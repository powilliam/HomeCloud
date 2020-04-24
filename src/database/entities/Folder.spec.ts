import { createConnection, getConnection, getRepository } from 'typeorm';

import { Folder } from './Folder';

import { development } from '../../config/database';
import { getFolder } from '../../mocks/entities';

describe('Testing Folder Schema', () => {
  beforeAll(async () => {
    await createConnection(development);
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.close();
  });

  it('should create a folder', async () => {
    const folderRepository = getRepository(Folder);

    const mockFolder = getFolder();
    const folder = folderRepository.create(mockFolder);
    await folderRepository.save(folder);

    const createdFolder = await folderRepository.findOne({
      where: { id: folder.id },
      relations: ['files'],
    });

    console.log('> Created folder: ', createdFolder);

    expect(createdFolder).toMatchObject(folder);

    await folderRepository.delete({ id: folder.id });
  });
});
