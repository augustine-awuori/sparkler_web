import styled from "styled-components";

import { useSparkle } from "../../hooks";
import SparkleForm from "../sparkle/SparkleForm";

export default function CreateSparkleTop() {
  const { createSparkle } = useSparkle();

  const handleSubmit = async (text: string, images: string[]) => {
    await createSparkle(text, images);
  };

  return (
    <Container>
      <SparkleForm placeholder="What's sparkling?" onSubmit={handleSubmit} />
    </Container>
  );
}

const Container = styled.div`
  padding: 15px;
`;
