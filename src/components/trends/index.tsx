import { Spinner } from "@chakra-ui/react";
import styled from "styled-components";

import { useTrendingHashtags } from "../../hooks";
import More from "../icons/More";

interface Props {
  query: string;
}

const Trends = ({ query }: Props) => {
  const { hashtags, isLoading } = useTrendingHashtags();

  const populated = Object.entries(hashtags);

  const queried = query
    ? populated.filter(([hashtag]) =>
        hashtag.toLowerCase().includes(query.toLowerCase())
      )
    : populated;

  return (
    <TrendsContainer>
      <h2>Trends for you</h2>

      {isLoading && (
        <div className="spinner-container">
          <Spinner size="md" color="teal.500" />
        </div>
      )}

      {!isLoading && !queried.length && query && (
        <p className="text-sm text-center">No results</p>
      )}

      <div className="trends-list">
        {queried.map(([hashtag, count], index) => (
          <div className="trend" key={index}>
            <div className="trend__details">
              <span className="trend__details__title">#{hashtag}</span>
              <span className="trend__details__tweets-count">
                {count} Sparkle{count === 1 ? "" : "s"}
              </span>
            </div>
            <button className="more-btn">
              <More color="#fff" />
            </button>
          </div>
        ))}
      </div>
    </TrendsContainer>
  );
};

const TrendsContainer = styled.div`
  background-color: #1c1f24;
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  flex-grow: 1;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #fff;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .trend {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #3c424c;

    &:last-child {
      border-bottom: none;
    }

    .trend__details {
      .trend__details__title {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
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
      color: #fff;
    }
  }

  .text-center {
    text-align: center;
    color: #657786;
  }

  .text-sm {
    font-size: 0.875rem;
  }
`;

export default Trends;
