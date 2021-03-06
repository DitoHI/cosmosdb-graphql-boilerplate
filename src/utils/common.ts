import { default as azureCustomStorage } from './azure_storage';
import { default as htmlToText } from 'html-to-text';

import { IUser } from '../model/User/UserModel';
import filesystem from './filesystem';

const createFileFromStream = async (upload: any) => {
  const { createReadStream, filename, mimetype } = await upload;
  const steam = createReadStream();
  const result: any = await filesystem.storeFs(steam, filename);
  return result.path;
};

export default {
  blogBlobContainerName: 'blog',
  userBlobContainerName: 'user',
  educationBlobContainerName: 'education',
  experienceBlobContainerName: 'experience',
  projectBlobContainerName: 'project',
  exitAppIfUnauthorized: (user: IUser, checkIsActive = true) => {
    if (!user) {
      throw Error('You are not authenticated');
    }
    if (checkIsActive && !user.isActived) {
      throw Error('You are currently not active');
    }
    return;
  },

  uploadCoverToAzure: async (upload: any, containerName: string) => {
    const fullPathCover = await createFileFromStream(upload);
    await azureCustomStorage.createContainer(containerName);
    const blobInfo: any = await azureCustomStorage.uploadLocalFile(
      containerName,
      fullPathCover
    );
    await filesystem.deleteFile(fullPathCover);
    return {
      url: blobInfo.url,
      name: blobInfo.name
    };
  },
  sortByDateAsc: (date1: Date, date2: Date) => {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  },
  sortByDateDesc: (date1: Date, date2: Date) => {
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  },
  convertHtmlToText: (htmlText: string) => {
    return htmlToText.fromString(htmlText, { wordwrap: false });
  },
  truncateString: (text: string, max: number = 85) => {
    return `${text.substring(0, max)}...`;
  },
  makeDashIdentified: (str: string, id: string): string => {
    const strWithoutSpecialChar = str.replace(/[^a-zA-Z ]/g, '');
    const strSplit = strWithoutSpecialChar.split(' ');
    const strChosen = strSplit.slice(0, 10);
    const finalStr = strChosen.join('-');
    return `${finalStr.toLowerCase()}-${id}`;
  },
  generateRandomString: (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i = i + 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};
