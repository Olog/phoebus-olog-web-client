import heic2any from "heic2any";
import { useState } from "react";

export const useFileUtils = () => {
  const [isConvertingFile, setIsConvertingFile] = useState(false);

  const splitFileName = (fileName) => {
    const lastDot = fileName.lastIndexOf(".");
    const name = fileName.slice(0, lastDot) ?? "unknown";
    const extension = fileName.slice(lastDot + 1).toLowerCase();
    return { name, extension };
  };

  const convertHeicToJpeg = async (file) => {
    setIsConvertingFile(true);
    if (file.type === "image/heic" || file.type === "image/heif") {
      try {
        const { name } = splitFileName(file.name);
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 1
        });

        setIsConvertingFile(false);
        return new File([convertedBlob], `${name}.jpeg`, {
          type: "image/jpeg",
          lastModified: file.lastModified
        });
      } catch (error) {
        setIsConvertingFile(false);
        console.error("Error converting HEIC to JPEG:", error);
        return file;
      }
    }
    setIsConvertingFile(false);
    return file;
  };

  return { convertHeicToJpeg, splitFileName, isConvertingFile };
};
