import { v4 } from "uuid";
import db from "./config";

const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e?.target?.result as string;
    };

    img.onerror = (error) => {
      reject(new Error("Image loading failed: " + error));
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_DIMENSION = 1080; // For high-quality social media images
      let width = img.width;
      let height = img.height;

      // Resize while maintaining aspect ratio
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the image on the canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Compress and convert to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            reject(new Error("Compression failed, returning original file."));
          }
        },
        "image/jpeg",
        quality
      ); // Use 'image/jpeg' for better compression quality
    };

    reader.readAsDataURL(file);
  });
};

export const saveFile = async (file: File) => {
  const compressedFile = await compressImage(file);
  const result = await db.uploadBytes(
    db.ref(db.storage, v4()),
    compressedFile,
    {
      contentType: compressedFile.type,
    }
  );

  return await db.getDownloadURL(result.ref);
};

export const saveFiles = async (files: File[]) => {
  const promises = files.map(async (file) => await saveFile(file));

  return Promise.all(promises);
};

export const deleteFile = async (url: string) =>
  await db.deleteObject(db.ref(db.storage, url));

export const deleteFiles = async (urls: string[]) => {
  const promises = urls.map(async (url) => await deleteFile(url));
  return Promise.all(promises);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  deleteFile,
  deleteFiles,
  saveFile,
  saveFiles,
};
