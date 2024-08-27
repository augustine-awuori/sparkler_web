import { Dispatch, SetStateAction, createContext } from "react";

interface FilesContextType {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

const FilesContext = createContext<FilesContextType>({
  files: [],
  setFiles: () => {},
});

FilesContext.displayName = "Files Context";

export default FilesContext;
