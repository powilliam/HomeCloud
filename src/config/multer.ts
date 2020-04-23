import { diskStorage } from 'multer';

export interface StorageConfig {
  destination: string;
}

export const createStorageConfig = ({ destination }: StorageConfig) =>
  diskStorage({
    destination: (request, file, callback) => {
      callback(null, destination);
    },
    filename: (request, file, callback) => {
      const { originalname } = file;

      const [filename, extension] = originalname.split('.');

      const uploadedFilename = `${Date.now()}-${filename}.${extension}`;

      callback(null, uploadedFilename);
    },
  });
