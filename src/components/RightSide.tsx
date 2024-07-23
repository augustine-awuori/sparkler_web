import classNames from "classnames";
import { useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Link } from "react-router-dom";
import styled from "styled-components";

import users from "../users";
import FollowBtn from "./FollowBtn";
import More from "./icons/More";
import Search from "./icons/Search";

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

export default function RightSide() {
  const [searchText, setSearchText] = useState("");
  const { client } = useStreamContext();

  const whoToFollow = users.filter((u) => {
    return u._id !== client?.userId;
  });

  return (
    <Container>
      <SearchContainer>
        <Search color="#fff" />
        <input
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search Sparkler"
          style={{ color: "#fff" }} /* Text color */
        />
        <button
          className={classNames(!Boolean(searchText) && "hide", "submit-btn")}
          type="button"
          onClick={() => setSearchText("")}
        >
          X
        </button>
      </SearchContainer>

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

      <FollowsContainer>
        <h2>Who to follow</h2>
        <div className="follows-list">
          {whoToFollow.map((user) => (
            <div className="user" key={user._id}>
              <Link to={`/${user._id}`} className="user__details">
                <div className="user__img">
                  <img src={user.avatar} alt="" />
                </div>
                <div className="user__info">
                  <span className="user__name">{user.name}</span>
                  <span className="user__id">@{user._id}</span>
                </div>
              </Link>
              <FollowBtn userId={user._id} />
            </div>
          ))}
        </div>
        <span className="show-more-text">Show more</span>
      </FollowsContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 350px;
  padding: 16px;
  background-color: #000;
  border-left: 1px solid #e1e8ed;
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

const TrendsContainer = styled.div`
  background-color: #1c1f24; /* Dark background */
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;

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

const FollowsContainer = styled.div`
  background-color: #1c1f24; /* Dark background */
  border-radius: 16px;
  padding: 16px;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #fff; /* Header text color */
  }

  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .user__details {
      display: flex;
      align-items: center;

      .user__img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user__info {
        .user__name {
          font-size: 16px;
          font-weight: bold;
          color: #fff; /* Text color */
        }

        .user__id {
          font-size: 12px;
          color: #657786;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px; /* Adjust the width as needed */
        }
      }
    }
  }

  .show-more-text {
    color: #1da1f2;
    cursor: pointer;
    display: block;
    text-align: center;
    margin-top: 16px;
  }
`;
