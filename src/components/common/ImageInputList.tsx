import { ChangeEvent, useState } from "react";
import { Box, FormControl, Flex, Image } from "@chakra-ui/react";

import { useFiles } from "../../hooks";
import ImagePicker from "./ImagePicker";

interface Props {
  imagesLimit: number;
}

const ImageInputList = ({ imagesLimit }: Props) => {
  const { addFiles, filesCount, removeFile } = useFiles(imagesLimit);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const addNewFiles = (oldItems: string[], newItems: string[]) =>
    [...oldItems, ...newItems].slice(0, imagesLimit);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    if (files) {
      const newSelectedFiles = Array.from(files);
      addFiles(newSelectedFiles);

      const newPreviews = newSelectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(addNewFiles(imagePreviews, newPreviews));
    }
  };

  const unSelectImageBy = (imageIndex: number) => {
    removeFile(imageIndex);

    setImagePreviews(
      imagePreviews.filter((preview, index) => {
        if (index !== imageIndex) return preview;
      })
    );
  };

  return (
    <Box maxWidth="400px" mb={2} mr={2}>
      <FormControl>
        <Box
          overflowX="auto"
          //   css={scrollBarModifierCss}
        >
          <Flex>
            <ImagePicker
              onChange={handleFileChange}
              visible={filesCount < imagesLimit}
            />
            <Flex>
              {imagePreviews.map((preview, index) => (
                <Image
                  key={index}
                  src={preview}
                  alt={`Selected Image ${index + 1}`}
                  boxSize="70px"
                  objectFit="cover"
                  margin="0 10px"
                  borderRadius="md"
                  cursor="pointer"
                  mr={2}
                  onClick={() => unSelectImageBy(index)}
                  minWidth="100px"
                />
              ))}
            </Flex>
          </Flex>
        </Box>
      </FormControl>
    </Box>
  );
};

export default ImageInputList;
