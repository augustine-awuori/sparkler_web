import { useState } from "react";
import { useBreakpointValue, Box } from "@chakra-ui/react";
import styled from "styled-components";

import Trends from "../components/trends";
import WhoToFollow from "../components/explore/WhoToFollow";
import SearchInput from "../components/trends/SearchInput";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const showWhoToFollowOnRight = useBreakpointValue({ base: false, lg: true });

  return (
    <Container>
      <SearchInput onQueryChange={setQuery} query={query} />

      <ContentContainer>
        <Trends query={query} />

        {showWhoToFollowOnRight ? (
          <RightSideContainer>
            <WhoToFollow />
          </RightSideContainer>
        ) : (
          <Box mt={4}>
            <WhoToFollow />
          </Box>
        )}
      </ContentContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  height: auto;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const RightSideContainer = styled.div`
  width: 300px;
  flex-shrink: 0;
  margin-left: 16px;
  @media (max-width: 1023px) {
    display: none;
  }
`;
