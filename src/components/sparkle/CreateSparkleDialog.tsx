import { useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useFiles, useSparkle } from "../../hooks";
import filesStorage from "../../storage/files";
import Modal from "../Modal";
import SparkleForm, { IMAGES_LIMIT } from "./SparkleForm";

interface Props {
  onClickOutside: () => void;
}

export default function CreateTweetDialog({ onClickOutside }: Props) {
  const { createSparkle } = useSparkle();
  const { files, filesCount, removeAllFiles } = useFiles(IMAGES_LIMIT);

  useEffect(() => {
    if (filesCount) removeAllFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (text: string) => {
    let imagesUrl: string[] = [];

    try {
      if (filesCount) imagesUrl = await filesStorage.saveFiles(files);
      await createSparkle(text, imagesUrl);
      onClickOutside();

      removeAllFiles();
    } catch (error) {
      toast.error("Sparkle couldn't be posted");
      await filesStorage.deleteFiles(imagesUrl);
    }
  };

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <SparkleForm
          onSubmit={onSubmit}
          shouldFocus={true}
          minHeight={240}
          className="tweet-form"
          placeholder="What's sparkling?"
        />
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  .modal-block {
    margin-top: 20px;
    padding: 15px;
    width: 600px;
    height: max-content;
    z-index: 10;
  }

  .tweet-form {
    margin-top: 20px;
  }
`;
