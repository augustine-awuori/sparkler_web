import { v4 } from "uuid";

import db from "./config";

export const saveFile = async (file: File) => {
  const result = await db.uploadBytes(db.ref(db.storage, v4()), file, {
    contentType: file.type,
  });

  return await db.getDownloadURL(result.ref);
};

export const saveFiles = (files: File[]) => {
  const promises = files.map(async (file) => await saveFile(file));

  return Promise.all(promises);
};

export const deletefile = async (url: string) =>
  await db.deleteObject(db.ref(db.storage, url));

export const deleteFiles = async (urls: string[]) => {
  const promises = urls.map(async (url) => await deletefile(url));

  Promise.all(promises);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  deletefile,
  deleteFiles,
  saveFile,
  saveFiles: saveFiles,
};
