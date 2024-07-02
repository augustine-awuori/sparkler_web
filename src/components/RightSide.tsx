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
    title: "#DataSciencve",
    tweetsCount: "18.6k",
    category: "Technology",
  },
];

const Container = styled.div``;

export default function RightSide() {
  const [searchText, setSearchText] = useState("");
  const { client } = useStreamContext();

  const whoToFollow = users.filter((u) => {
    // filter out currently logged in user
    return u._id !== client?.userId;
  });

  return (
    <Container>
      <div className="search-container">
        <form className="search-form">
          <div className="search-icon">
            <Search color="rgba(85,85,85,1)" />
          </div>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <button
            className={classNames(!Boolean(searchText) && "hide", "submit-btn")}
            type="button"
            onClick={() => setSearchText("")}
          >
            X
          </button>
        </form>
      </div>

      <div className="trends">
        <h2>Trends for you</h2>
        <div className="trends-list">
          {trends.map((trend, i) => {
            return (
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
                    {trend.tweetsCount} Tweets
                  </span>
                </div>
                <button className="more-btn">
                  <More color="white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="follows">
        <h2>Who to follow</h2>
        <div className="follows-list">
          {whoToFollow.map((user) => {
            return (
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
            );
          })}
        </div>
        <span className="show-more-text">Show more</span>
      </div>
    </Container>
  );
}
