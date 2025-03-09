import { Button } from "@chakra-ui/react";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";

import {
  Bell,
  Bookmark,
  Home,
  Mail,
  Search,
  Sparkle,
  User,
} from "../assets/icons";
import { events, logEvent } from "../storage/analytics";
import { logout } from "../hooks/useAuth";
import {
  useNewNotifications,
  useProfileUser,
  useUnreadMessages,
  useUser,
  useShowSparkleModal,
} from "../hooks";

type Menu = {
  id:
    | "bookmarks"
    | "home"
    | "explore"
    | "notifications"
    | "messages"
    | "profile";
  label: string;
  Icon: (props: {
    color?: string | undefined;
    size?: number | undefined;
    fill?: boolean | undefined;
  }) => JSX.Element;
  link: string;
  value?: number;
};

export default function LeftSide() {
  const { count } = useUnreadMessages();
  const { newNotifications } = useNewNotifications();
  const { viewUserProfile } = useProfileUser();
  const { user } = useUser();
  const { setShowSparkleModal } = useShowSparkleModal();
  const location = useLocation();
  const navigate = useNavigate();

  const menus: Menu[] = [
    { id: "home", label: "Home", Icon: Home, link: "/" },
    { id: "explore", label: "Explore", Icon: Search, link: "/explore" },
    {
      id: "notifications",
      label: "Notifications",
      Icon: Bell,
      link: "/notifications",
      value: newNotifications,
    },
    { id: "bookmarks", label: "Bookmarks", Icon: Bookmark, link: "/bookmarks" },
    {
      id: "messages",
      label: "Messages",
      link: "/messages",
      Icon: Mail,
      value: count,
    },
    { id: "profile", label: "Profile", Icon: User, link: `/${user?.username}` },
  ];

  const checkIsValidNavigation = (menuItem: Menu): boolean =>
    Boolean(user || menuItem.id === "home" || menuItem.id === "explore");

  const getRoute = (menuItem: Menu): To =>
    checkIsValidNavigation(menuItem) ? menuItem.link : "/auth";

  const handleItemClick = (menuItem: Menu) => {
    logEvent(events.general.PAGE_VIEW, { pageLink: menuItem.link });
    if (menuItem.id === "profile" && user) return viewUserProfile(user);
    navigate(getRoute(menuItem));
  };

  const isActiveLink = (menu: Menu): boolean => {
    if (location.pathname === "/" && menu.id === "home") return true;
    return (
      location.pathname === `/${menu.id}` ||
      (menu.id === "profile" && location.pathname === `/${user?.username}`)
    );
  };

  return (
    <Container>
      <LogoLink to="/">
        <Sparkle color={theme.textColor} size={24} />
      </LogoLink>
      <NavButtons>
        {menus.map((menu) => {
          const isActive = isActiveLink(menu);
          return (
            <NavLink
              to={getRoute(menu)}
              key={menu.id}
              isActive={isActive}
              onClick={() => handleItemClick(menu)}
            >
              <IconContainer>
                {menu.value && user ? (
                  <NotificationBadge>{menu.value}</NotificationBadge>
                ) : null}
                <menu.Icon
                  fill={isActive}
                  color={isActive ? theme.textColor : theme.grayColor}
                  size={16}
                />
              </IconContainer>
              <Label>{menu.label}</Label>
            </NavLink>
          );
        })}
      </NavButtons>
      <SparkleButton onClick={() => setShowSparkleModal(true)}>
        Sparkle
      </SparkleButton>
      <ProfileSection>
        {user ? (
          <ActionButton
            isLogout
            onClick={logout}
            leftIcon={<FaSignOutAlt size={16} />}
          >
            Logout
          </ActionButton>
        ) : (
          <ActionButton
            onClick={() => navigate("/auth")}
            leftIcon={<FaSignInAlt size={16} />}
          >
            Login
          </ActionButton>
        )}
      </ProfileSection>
    </Container>
  );
}

const theme = {
  primaryColor: "var(--primary-color)", // #1da1f2
  primaryHoverColor: "var(--primary-hover-color)", // #1a91da
  backgroundColor: "var(--background-color)", // #15202b
  borderColor: "var(--border-color)", // #38444d
  textColor: "var(--text-color)", // #fff
  grayColor: "var(--gray-color)", // #888888
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  height: 100vh;
  border-right: 1px solid ${theme.borderColor};
  position: sticky;
  top: 0;
`;

const LogoLink = styled(Link)`
  padding: 12px;
  display: flex;
  align-items: center;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const NavButtons = styled.div`
  margin-top: 10px;
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: ${(props) => (props.isActive ? theme.textColor : theme.grayColor)};
  text-decoration: none;
  border-radius: 30px;
  font-size: 1.1rem; // Slightly smaller than 18px
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${theme.textColor};
  }
`;

const IconContainer = styled.div`
  position: relative;
  margin-right: 20px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${theme.primaryColor};
  color: ${theme.textColor};
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  font-weight: 600;
`;

const Label = styled.span`
  white-space: nowrap;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SparkleButton = styled.button`
  width: 80%;
  margin: 15px auto 0;
  padding: 12px;
  background: ${theme.primaryColor};
  color: ${theme.textColor};
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.primaryHoverColor};
    transform: translateY(-1px);
  }
`;

const ProfileSection = styled.div`
  margin-top: auto;
  padding: 10px 0 20px;
`;

const ActionButton = styled(Button)<{ isLogout?: boolean }>`
  width: 100%;
  padding: 10px 15px;
  background: ${(props) => (props.isLogout ? "#e33437" : "transparent")};
  color: ${(props) => (props.isLogout ? theme.textColor : theme.primaryColor)};
  border: ${(props) =>
    props.isLogout ? "none" : `1px solid ${theme.primaryColor}`};
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.isLogout ? "#e60000" : "rgba(29, 161, 242, 0.1)"};
    color: ${(props) =>
      props.isLogout ? theme.textColor : theme.primaryHoverColor};
    border-color: ${(props) => !props.isLogout && theme.primaryHoverColor};
  }
`;
