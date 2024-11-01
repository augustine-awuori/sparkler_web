import { useState } from "react";
import styled from "styled-components";

import SearchInput from "./trends/SearchInput";
import Trends from "./trends";
import WhoToFollow from "./explore/WhoToFollow";

export default function RightSide() {
  const [query, setQuery] = useState("");

  return (
    <Container>
      <SearchInput onQueryChange={setQuery} query={query} />
      <Trends query={query} verified />
      <Trends query={query} />
      <WhoToFollow query={query} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 350px;
  padding: 16px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  height: auto;
  box-sizing: border-box;
`;
