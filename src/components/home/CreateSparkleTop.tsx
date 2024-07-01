import styled from "styled-components";

import SparkleForm from "../sparkle/SparkleForm";

const Container = styled.div`
  padding: 15px;
`;

export default function CreateTweetTop() {
  const onSubmit = async (_text: string) => {
    // create sparkle here
  };

  return (
    <Container>
      <SparkleForm placeholder="What's sparkling?" onSubmit={onSubmit} />
    </Container>
  );
}
