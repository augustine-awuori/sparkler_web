import { Button } from "@chakra-ui/react";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import { IoLogOut, IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import classNames from "classnames";
import styled from "styled-components";

import { events, logEvent } from "../storage/analytics";
import { useNewNotifications, useUnreadMessages, useUser } from "../hooks";
import auth from "../services/auth";
import Bell from "./icons/Bell";
import Hashtag from "./icons/Hashtag";
import Home from "./icons/Home";
import Mail from "./icons/Mail";
import Sparkle from "./icons/Twitter";
import User from "./icons/User";

interface Props {
  onClickSparkle: () => void;
}

type Menu = {
  id: "home" | "explore" | "notifications" | "messages" | "profile";
  label: string;
  Icon: (props: {
    color?: string | undefined;
    size?: number | undefined;
    fill?: boolean | undefined;
  }) => JSX.Element;
  link: string;
  value?: number;
};

export default function LeftSide({ onClickSparkle }: Props) {
  const location = useLocation();
  const { user } = useUser();
  const { newNotifications } = useNewNotifications();
  const { count } = useUnreadMessages();
  const navigate = useNavigate();

  const menus: Menu[] = [
    {
      id: "home",
      label: "Home",
      Icon: Home,
      link: "/",
    },
    {
      id: "explore",
      label: "Explore",
      Icon: Hashtag,
      link: "/explore",
    },
    {
      id: "notifications",
      label: "Notifications",
      Icon: Bell,
      link: "/notifications",
      value: newNotifications,
    },
    {
      id: "messages",
      label: "Messages",
      link: "/messages",
      Icon: Mail,
      value: count,
    },
    {
      id: "profile",
      label: "Profile",
      Icon: User,
      link: `/${user?.username || ""}`,
    },
  ];

  const logout = () => {
    auth.logout();
    window.location.reload();
  };

  const checkIsValidNavigation = (menuItem: Menu): boolean =>
    Boolean(user || menuItem.id === "home" || menuItem.id === "explore");

  const getRoute = (menuItem: Menu): To =>
    checkIsValidNavigation(menuItem) ? menuItem.link : "/auth";

  const handleItemClick = (menuItem: Menu) => {
    logEvent(events.general.PAGE_VIEW, { pageLink: menuItem.link });
    navigate(getRoute(menuItem));
  };

  return (
    <Container>
      <Link to="/" className="header">
        <Sparkle color="white" size={25} />
      </Link>
      <div className="buttons">
        {menus.map((item) => {
          const isActiveLink =
            location.pathname === `/${item.id}` ||
            (item.id === "profile" &&
              location.pathname === `/${user?.username}`);

          return (
            <Link
              to={getRoute(item)}
              className={classNames(
                `btn--${item.id} new-tweets`,
                isActiveLink && "active"
              )}
              key={item.id}
              onClick={() => handleItemClick(item)}
            >
              <div className="btn--icon">
                {item.value && user ? (
                  <span className="value-count">{item.value}</span>
                ) : null}
                <item.Icon fill={isActiveLink} color="white" size={25} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <Button
        onClick={onClickSparkle}
        className="tweet-btn"
        leftIcon={<IoSparkles color="#fff" />}
        _hover={{ bg: "var(--conc-theme-color)" }}
      >
        Sparkle
      </Button>

      <div className="profile-section">
        {user ? (
          <Button
            leftIcon={<IoLogOut />}
            className="logout-button"
            onClick={logout}
          >
            Logout
          </Button>
        ) : (
          <Button
            leftIcon={<FcGoogle size={20} />}
            className="login-button"
            _hover={{ bg: "#db4437", color: "white" }}
            onClick={() => navigate("/auth")}
          >
            Login with Google
          </Button>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  height: 100%;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Hide horizontal scrolling */
  border-right: 1px solid #333;

  .header {
    padding: 15px;
  }

  .buttons {
    margin-top: 5px;
    max-width: 200px;

    a,
    button {
      display: block;
      margin-bottom: 8px; /* Adjusted margin here */
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
        .value-count {
          position: absolute;
          font-size: 11px;
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

      span {
        white-space: nowrap; /* Prevent text from wrapping */
        overflow: hidden; /* Hide text overflow */
        text-overflow: ellipsis; /* Display ellipsis (...) for overflowed text */
      }
    }
  }

  .login-button {
    width: 100%;
    background-color: white;
    color: #db4437;
    border: 1px solid #db4437;
    border-radius: 30px;
    font-size: 16px;
    padding: 10px 0;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover {
      background-color: #db4437; /* Background color on hover */
      color: white; /* Change text color to white */
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.5); /* Focus shadow */
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
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    border-radius: 30px;

    &:hover {
      background-color: #333;
    }

    .logout-button {
      width: 100%; /* Take full width of the container */
      background-color: #e33437; /* Red color for emphasis */
      border: none;
      color: white;
      padding: 10px 0; /* Adjust padding to make it more button-like */
      border-radius: 30px; /* Keep the rounded corners */
      cursor: pointer;
      font-size: 16px; /* Adjust font size */
      transition: background-color 0.3s ease;
      text-align: center; /* Center text */

      &:hover {
        background-color: #e60000; /* Darker red on hover */
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.5);
      }
    }
  }
`;
