import shortid from 'shortid';
import * as fs from 'fs';

export default {
  storeFs: (stream: any, filename: string) => {
    const id = shortid.generate();
    const path = `${process.cwd()}/public/blog/${id}-${filename}`;
    return new Promise((resolve, reject) => {
      return stream
        .on('error', (err: any) => {
          if (stream.truncated) {
            fs.unlinkSync(path);
            reject(err);
          }
        })
        .pipe(fs.createWriteStream(path))
        .on('error', (error: any) => reject(error))
        .on('finish', () => resolve({ id, path }));
    });
  },
  deleteFile: (filepath: string) => {
    return new Promise((resolve, reject) => {
      fs.unlink(filepath, err => {
        if (err) reject(err);
        else resolve(filepath);
      });
    });
  }
};
