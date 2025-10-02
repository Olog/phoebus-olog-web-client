import { useMemo, useState } from "react";

const UNSUPPORTED_FILE_TYPES = ["image/heic"];

const getUnsupportedLabel = (arr) =>
  arr.map((val, i) => (i < arr.length - 1 ? `${val}, ` : val));

export const useUnsupported = () => {
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);

  const unsupportedFileTypes = useMemo(
    () =>
      getUnsupportedLabel([
        ...new Set(
          unsupportedFiles.map((file) => {
            return file?.type?.split("/")[1].toUpperCase();
          })
        )
      ]),
    [unsupportedFiles]
  );
  const unsupportedFileNames = useMemo(
    () =>
      getUnsupportedLabel([
        ...new Set(unsupportedFiles.map((file) => file.name))
      ]),
    [unsupportedFiles]
  );

  const checkIsUnsupported = (file) => {
    if (UNSUPPORTED_FILE_TYPES.includes(file.type)) {
      setUnsupportedFiles((prev) => [
        ...prev,
        { type: file.type, name: file.name }
      ]);
      return true;
    }
    return false;
  };

  return {
    unsupportedFiles,
    unsupportedFileTypes,
    unsupportedFileNames,
    setUnsupportedFiles,
    checkIsUnsupported
  };
};
