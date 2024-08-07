import styled from "styled-components";

import { useSparkle } from "../../hooks";
import SparkleForm from "../sparkle/SparkleForm";

export default function CreateSparkleTop() {
  const { createSparkle } = useSparkle();

  const handleSubmit = async (text: string) => {
    await createSparkle(text);
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
