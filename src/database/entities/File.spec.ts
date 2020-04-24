import { createConnection, getConnection, getRepository } from 'typeorm';

import { Folder } from './Folder';
import { File } from './File';

import { development } from '../../config/database';
import { getFolder, getFile } from '../../mocks/entities';

describe('Testing File Schema', () => {
  beforeAll(async () => {
    await createConnection(development);
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.close();
  });

  it('should create a file', async () => {
    const fileRepository = getRepository(File);

    const mockFile = getFile({
      accessUrl: 'localhost',
    });
    const file = fileRepository.create(mockFile);
    await fileRepository.save(file);

    const createdFile = await fileRepository.findOne({
      where: { id: file.id },
    });

    console.log('> Created file: ', createdFile);

    expect(createdFile).toMatchObject(file);

    await fileRepository.delete({ id: file.id });
  });

  it('should create a file related to a folder', async () => {
    const folderRepository = getRepository(Folder);
    const fileRepository = getRepository(File);

    const mockFolder = getFolder();
    const folder = folderRepository.create(mockFolder);
    await folderRepository.save(folder);

    const mockFile = getFile({
      folder,
      accessUrl: 'localhost',
    });
    const file = fileRepository.create(mockFile);
    await fileRepository.save(file);

    const createdFile = await fileRepository.findOne({
      where: { id: file.id },
      relations: ['folder'],
    });

    const insertedFolder = await folderRepository.findOne({
      where: {
        id: folder.id,
      },
      relations: ['files'],
    });

    console.log('> Inserted folder: ', insertedFolder);
    console.log('> Created file: ', createdFile);

    expect(createdFile).toMatchObject(file);
    expect(insertedFolder?.files.length).toBeGreaterThan(0);

    await fileRepository.delete({ id: file.id });
    await folderRepository.delete({ id: folder.id });
  });
});
