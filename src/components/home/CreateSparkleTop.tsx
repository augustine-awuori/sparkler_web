import styled from "styled-components";
import { toast } from "react-toastify";

import { useSparkle, useUser } from "../../hooks";
import SparkleForm from "../sparkle/SparkleForm";

export default function CreateSparkleTop() {
  const { createSparkle } = useSparkle();
  const { user } = useUser();

  const handleSubmit = async (text: string, images: string[]) => {
    user ? await createSparkle(text, images) : toast.info("Login to sparkle");
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
