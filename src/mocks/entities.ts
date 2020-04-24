import { Folder } from '../database/entities/Folder';

interface File {
  folder?: Folder;
  accessUrl?: string;
}

export const getFolder = () => {
  return {
    accessCode: '123',
    name: 'test',
  };
};

export const getFile = ({ folder, accessUrl }: File) => {
  return {
    name: 'test',
    size: 12,
    accessUrl,
    mimetype: 'text/plain',
    folder,
  };
};
