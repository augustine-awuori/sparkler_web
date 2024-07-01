import classNames from "classnames";
import { useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import { User as UserType } from "../users";
import LoadingIndicator from "./LoadingIndicator";
import Bell from "./icons/Bell";
import Group from "./icons/Group";
import Home from "./icons/Home";
import Hashtag from "./icons/Hashtag";
import Mail from "./icons/Mail";
import Bookmark from "./icons/Bookmark";
import User from "./icons/User";
import More from "./icons/More";
import Twitter from "./icons/Twitter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  height: 100%;

  .header {
    padding: 15px;
  }

  .buttons {
    margin-top: 5px;
    max-width: 200px;

    a,
    button {
      display: block;
      margin-bottom: 12px;
      color: white;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      border-radius: 30px;
      font-size: 18px;
      padding-right: 25px;
      text-decoration: none;
      --icon-size: 25px;

      .btn--icon {
        margin-right: 15px;
        height: var(--icon-size);
        width: var(--icon-size);

        position: relative;
        .notifications-count {
          position: absolute;
          font-size: 11px;
          /* min-width: 14px; */
          background-color: var(--theme-color);
          top: -5px;
          padding: 1px 5px;
          border-radius: 10px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: max-content;
        }
      }

      &.active {
        font-weight: bold;

        img {
          --size: 27px;
        }
      }

      &:hover {
        background-color: #333;
      }

      &.btn--home {
        position: relative;
        &.new-tweets::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          left: 35px;
          top: 7px;
          border-radius: 50%;
          background-color: var(--theme-color);
        }
      }

      &.btn--more {
        svg {
          border: 1px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .tweet-btn {
    background-color: var(--theme-color);
    margin-top: 10px;
    border-radius: 30px;
    color: white;
    text-align: center;
    padding: 15px 0;
    font-size: 16px;
  }

  .profile-section {
    margin-top: auto;
    margin-bottom: 20px;
    padding: 10px;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    border-radius: 30px;

    &:hover {
      background-color: #333;
    }

    .details {
      display: flex;
      align-items: center;
      &__img {
        margin-right: 10px;
        width: 40px;
        border-radius: 50%;
        height: 40px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &__text {
        span {
          display: block;
        }

        &__name {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }

        &__id {
          font-size: 14px;
          margin-top: 2px;
          color: #aaa;
        }
      }
    }
  }
`;

interface Props {
  onClickSparkle: () => void;
}

export default function LeftSide({ onClickSparkle }: Props) {
  const location = useLocation();
  const { userData } = useStreamContext();
  const [newNotifications, setNewNotifications] = useState(0);

  if (!userData)
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );

  const menus = [
    {
      id: "home",
      label: "Home",
      Icon: Home,
      link: "/home",
      onClick: () => {},
    },
    {
      id: "explore",
      label: "Explore",
      Icon: Hashtag,
      onClick: () => {},
    },
    {
      id: "communities",
      onClick: () => {},
      label: "Communities",
      Icon: Group,
    },
    {
      id: "notifications",
      label: "Notifications",
      Icon: Bell,
      onClick: () => {},
      link: "/notifications",
      value: newNotifications,
    },
    {
      id: "messages",
      onClick: () => {},
      label: "Messages",
      Icon: Mail,
    },
    {
      id: "bookmarks",
      onClick: () => {},
      label: "Bookmarks",
      Icon: Bookmark,
    },
    {
      id: "profile",
      onClick: () => {},
      label: "Profile",
      Icon: User,
      link: `/${userData.id}`,
    },
  ];

  return (
    <Container>
      <Link to="/" className="header">
        <Twitter color="white" size={25} />
      </Link>
      <div className="buttons">
        {menus.map((m) => {
          const isActiveLink =
            location.pathname === `/${m.id}` ||
            (m.id === "profile" && location.pathname === `/${userData.id}`);

          return (
            <Link
              to={m.link ?? "#"}
              className={classNames(
                `btn--${m.id} new-tweets`,
                isActiveLink && "active"
              )}
              key={m.id}
              onClick={m.onClick}
            >
              <div className="btn--icon">
                {newNotifications && m.id === "notifications" ? (
                  <span className="notifications-count">
                    {newNotifications}
                  </span>
                ) : null}
                <m.Icon fill={isActiveLink} color="white" size={25} />
              </div>
              <span>{m.label}</span>
            </Link>
          );
        })}
        <button className="btn--more">
          <div className="btn--icon">
            <More color="white" size={20} />
          </div>
          <span>More</span>
        </button>
      </div>
      <button onClick={onClickSparkle} className="tweet-btn">
        Sparkle
      </button>
      <button className="profile-section">
        <div className="details">
          <div className="details__img">
            <img src={(userData as UserType | undefined)?.image} alt="" />
          </div>
          <div className="details__text">
            <span className="details__text__name">{userData.name}</span>
            <span className="details__text__id">@{userData.id}</span>
          </div>
        </div>
        <div>
          <More color="white" />
        </div>
      </button>
    </Container>
  );
}
