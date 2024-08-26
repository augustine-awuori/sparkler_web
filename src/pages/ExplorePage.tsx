import { useState } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { useBreakpointValue, Box, Image, Flex } from "@chakra-ui/react";

import logo from "../assets/logo.png";
import Search from "../components/icons/Search";
import More from "../components/icons/More";
import WhoToFollow from "../components/explore/WhoToFollow";

const trends = [
  {
    title: "iPhone 12",
    tweetsCount: "11.6k",
    category: "Technology",
  },
  {
    title: "LinkedIn",
    tweetsCount: "51.1K",
    category: "Business & finance",
  },
  {
    title: "John Cena",
    tweetsCount: "1,200",
    category: "Sports",
  },
  {
    title: "#Microsoft",
    tweetsCount: "3,022",
    category: "Business & finance",
  },
  {
    title: "#DataScience",
    tweetsCount: "18.6k",
    category: "Technology",
  },
];

export default function ExplorePage() {
  const [searchText, setSearchText] = useState("");
  const showWhoToFollowOnRight = useBreakpointValue({ base: false, lg: true });

  return (
    <Container>
      <Flex
        direction="column"
        align="center"
        mb={4}
        display={{ base: "flex", md: "none" }}
      >
        <Image src={logo} boxSize="20px" />
      </Flex>
      <SearchContainer>
        <Search color="#fff" />
        <input
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search Sparkler"
          style={{ color: "#fff" }}
        />
        <button
          className={classNames(!Boolean(searchText) && "hide", "submit-btn")}
          type="button"
          onClick={() => setSearchText("")}
        >
          X
        </button>
      </SearchContainer>

      <ContentContainer>
        <TrendsContainer>
          <h2>Trends for you</h2>
          <div className="trends-list">
            {trends.map((trend, i) => (
              <div className="trend" key={trend.title + "-" + i}>
                <div className="trend__details">
                  <div className="trend__details__category">
                    {trend.category}
                    <span className="trend__details__category--label">
                      Trending
                    </span>
                  </div>
                  <span className="trend__details__title">{trend.title}</span>
                  <span className="trend__details__tweets-count">
                    {trend.tweetsCount} Sparkles
                  </span>
                </div>
                <button className="more-btn">
                  <More color="#fff" />
                </button>
              </div>
            ))}
          </div>
        </TrendsContainer>

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

const SearchContainer = styled.div`
  background-color: #333;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  input {
    border: none;
    outline: none;
    background-color: transparent;
    flex-grow: 1;
    margin-left: 8px;
    color: #fff; /* Text color */
  }

  .submit-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #fff; /* Text color */
  }

  .hide {
    display: none;
  }
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

const TrendsContainer = styled.div`
  background-color: #1c1f24; /* Dark background */
  border-radius: 16px;
  padding: 16px;
  flex-grow: 1;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #fff; /* Header text color */
  }

  .trend {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #3c424c; /* Border color */

    &:last-child {
      border-bottom: none;
    }

    .trend__details {
      .trend__details__category {
        font-size: 12px;
        color: #657786;
        margin-bottom: 4px;

        .trend__details__category--label {
          font-weight: bold;
          color: #fff; /* Label text color */
        }
      }

      .trend__details__title {
        font-size: 16px;
        font-weight: bold;
        color: #fff; /* Title text color */
      }

      .trend__details__tweets-count {
        font-size: 12px;
        color: #657786;
        margin-top: 4px;
      }
    }

    .more-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #fff; /* Button color */
    }
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
