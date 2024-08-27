import { useContext } from "react";

import { FilesContext } from "../contexts";

const useFiles = (filesLimit: number) => {
  const context = useContext(FilesContext);

  const files = context?.files || [];

  const getNewFiles = (newFiles: File[]) =>
    [...(context?.files || []), ...newFiles].slice(0, filesLimit);

  const addFiles = (files: File[]) => context?.setFiles(getNewFiles(files));

  const removeFile = (fileIndex: number) =>
    context?.setFiles(
      context.files.filter((file, index) => {
        if (index !== fileIndex) return file;
      })
    );

  const removeAllFiles = () => context?.setFiles([]);

  return {
    addFiles,
    files,
    filesCount: files.length,
    removeFile,
    removeAllFiles,
  };
};

export default useFiles;
