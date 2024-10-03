import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useSparkle, useUser } from "../../hooks";
import SparkleForm from "../sparkle/SparkleForm";

export default function CreateSparkleTop() {
  const { createSparkle } = useSparkle();
  const { user } = useUser();
  const [sparkling, setSparkling] = useState(false);

  const handleSubmit = async (text: string, images: string[]) => {
    if (sparkling) return;

    setSparkling(true);
    toast.loading("Sparkling...");
    user ? await createSparkle(text, images) : toast.info("Login to sparkle");
    toast.dismiss();
    setSparkling(false);
  };

  return (
    <Container>
      <SparkleForm
        onSubmit={handleSubmit}
        placeholder="What's sparkling?"
        sparkling={sparkling}
        submitText={sparkling ? "Sparkling..." : "Sparkle"}
      />
    </Container>
  );
}

const Container = styled.div`
  padding: 15px;
`;
