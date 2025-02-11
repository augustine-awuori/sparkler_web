import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { More } from "../../assets/icons";
import { useTrendingHashtags } from "../../hooks";

interface Props {
  isAdmin?: boolean;
  query: string;
  verified?: boolean;
}

const Trends = ({ isAdmin, query, verified }: Props) => {
  const navigate = useNavigate();
  const { hashtags, isLoading, verifiedHashtags } = useTrendingHashtags();

  const populated = Object.entries(verified ? verifiedHashtags : hashtags);

  const queried = query
    ? populated.filter(([hashtag]) =>
        hashtag.toLowerCase().includes(query.toLowerCase())
      )
    : populated;

  const sorted = queried.sort((a, b) => b[1] - a[1]);

  const showSparklesOfHashtag = (hashtag: string) =>
    navigate(`/explore/${hashtag}`);

  return (
    <TrendsContainer>
      <h2>
        {verified && (
          <img
            src={
              isAdmin
                ? require("../../assets/admin.png")
                : require("../../assets/verified.png")
            }
            alt="Verified"
            className="verified-icon"
          />
        )}
        Hashtags
      </h2>

      {isLoading && (
        <div className="spinner-container">
          <Spinner size="md" color="teal.500" />
        </div>
      )}

      {!isLoading && !queried.length && query && (
        <p className="text-sm text-center">No results</p>
      )}

      <div className="trends-list">
        {sorted.map(([hashtag, count], index) => (
          <div
            className="trend"
            key={index}
            onClick={() => showSparklesOfHashtag(hashtag)}
          >
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
    text-align: center;
    margin-bottom: 16px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .verified-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .trend {
    cursor: pointer;
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
