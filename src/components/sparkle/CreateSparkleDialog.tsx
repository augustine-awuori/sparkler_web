import styled from "styled-components";

import { useSparkle } from "../../hooks";
import Modal from "../Modal";
import SparkleForm from "./SparkleForm";

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

interface Props {
  onClickOutside: () => void;
}

export default function CreateTweetDialog({ onClickOutside }: Props) {
  const { createSparkle } = useSparkle();

  const onSubmit = async (text: string) => {
    createSparkle(text);
    onClickOutside();
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
