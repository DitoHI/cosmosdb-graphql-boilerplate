import path from 'path';
import { default as storage } from 'azure-storage';

const blobService = storage.createBlobService();

export default {
  listContainer: async () => {
    return new Promise((resolve, reject) => {
      blobService.listContainersSegmented(null, (err, data) => {
        if (err) reject(err);
        else {
          resolve({
            message: `${data.entries.length} containers`,
            containers: data.entries
          });
        }
      });
    });
  },
  createContainer: async (containerName: string) => {
    return new Promise((resolve, reject) => {
      blobService.createContainerIfNotExists(
        containerName,
        {
          publicAccessLevel: 'blob'
        },
        err => {
          if (err) reject(err);
          else resolve({ message: `Container '${containerName}' created` });
        }
      );
    });
  },
  uploadLocalFile: async (containerName: string, filePath: string) => {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(filePath);
      const blobName = `${path.basename(filePath)}-${Date.now()}`;
      blobService.createBlockBlobFromLocalFile(
        containerName,
        blobName,
        fullPath,
        err => {
          if (err) reject(err);
          else {
            resolve(blobService.getUrl(containerName, blobName));
          }
        }
      );
    });
  },
  deleteBlob: async (containerName: string, blobName: string) => {
    return new Promise((resolve, reject) => {
      blobService.deleteBlobIfExists(containerName, blobName, err => {
        if (err) reject(err);
        else resolve({ message: `Block blob '${blobName}' deleted` });
      });
    });
  }
};
