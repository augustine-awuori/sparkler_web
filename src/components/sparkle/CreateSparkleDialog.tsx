import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useFiles, useShowSparkleModal, useSparkle } from "../../hooks";
import filesStorage from "../../storage/files";
import Modal from "../Modal";
import SparkleForm, { IMAGES_LIMIT } from "./SparkleForm";

export default function CreateTweetDialog() {
  const { createSparkle } = useSparkle();
  const { files, filesCount, removeAllFiles } = useFiles(IMAGES_LIMIT);
  const { setShowSparkleModal, showSparkleModal } = useShowSparkleModal();
  const [sparkling, setSparkling] = useState(false);

  useEffect(() => {
    if (filesCount) removeAllFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeDialog = () => setShowSparkleModal(false);

  const onSubmit = async (text: string) => {
    if (sparkling) return;

    let imagesUrl: string[] = [];

    setSparkling(true);
    toast.loading("Sparkling...");
    try {
      if (filesCount) imagesUrl = await filesStorage.saveFiles(files);
      await createSparkle(text, imagesUrl);

      closeDialog();
      removeAllFiles();
    } catch (error) {
      toast.error("Sparkle couldn't be posted");
      await filesStorage.deleteFiles(imagesUrl);
    }
    toast.dismiss();
    setSparkling(false);
  };

  if (!showSparkleModal) return null;

  return (
    <Container>
      <Modal onClickOutside={closeDialog} className="modal-block">
        <SparkleForm
          onSubmit={onSubmit}
          shouldFocus={true}
          minHeight={240}
          className="tweet-form"
          placeholder="What's sparkling?"
          sparkling={sparkling}
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
