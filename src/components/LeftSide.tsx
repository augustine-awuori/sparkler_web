import { useState } from "react";
import { Avatar } from "react-activity-feed";
import { Button } from "@chakra-ui/react";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaEllipsisV, FaSignInAlt } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
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

interface CustomIconProps {
  color?: string;
  size?: number;
  fill?: boolean;
}

type CustomIcon = (props: CustomIconProps) => JSX.Element;

type Menu = {
  id:
    | "bookmarks"
    | "home"
    | "explore"
    | "communities"
    | "notifications"
    | "messages"
    | "profile";
  label: string;
  Icon: CustomIcon;
  link: string;
  value?: number;
};

const GroupIcon = ({ fill, ...props }: CustomIconProps) => (
  <FaUserGroup fill={props.color} {...props} />
);

export default function LeftSide() {
  const { count } = useUnreadMessages();
  const { newNotifications } = useNewNotifications();
  const { viewUserProfile } = useProfileUser();
  const { user } = useUser();
  const { setShowSparkleModal } = useShowSparkleModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menus: Menu[] = [
    { id: "home", label: "Home", Icon: Home, link: "/" },
    { id: "explore", label: "Explore", Icon: Search, link: "/explore" },
    {
      id: "communities",
      label: "Communities",
      Icon: GroupIcon,
      link: "/communities",
    },
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
    !(
      menuItem.id === "profile" ||
      menuItem.id === "notifications" ||
      menuItem.id === "messages" ||
      menuItem.id === "bookmarks"
    );

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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/auth");
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
          <ProfileContainer
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setIsDropdownOpen(false)}
            tabIndex={0}
          >
            <Avatar image={user.profileImage || ""} size={40} circle={true} />
            <ProfileInfo>
              <Username>{user.name || user.username}</Username>
              <Handle>@{user.username}</Handle>
            </ProfileInfo>
            <DotsIcon>
              <FaEllipsisV size={16} color={theme.grayColor} />
            </DotsIcon>
            {isDropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={handleLogout}>
                  <FaSignOutAlt size={14} />
                  <span>Logout</span>
                </DropdownItem>
              </Dropdown>
            )}
          </ProfileContainer>
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
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  min-width: 230px;
  height: 100vh;
  border-right: 1px solid ${theme.borderColor};
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    min-width: 200px; /* Slightly narrower on tablets */
    padding: 0 8px; /* Reduced padding on smaller screens */
  }

  @media (max-width: 480px) {
    min-width: 180px; /* Narrower on mobile */
    padding: 0 6px; /* Further reduced padding on mobile */
  }
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
  font-size: 1.1rem;
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

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: none;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
`;

const Username = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Handle = styled.div`
  font-size: 0.8rem;
  color: ${theme.grayColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DotsIcon = styled.div`
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.textColor};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: -90px;
  right: 0;
  background: ${theme.backgroundColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 150px;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: ${theme.textColor};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 8px;
  }
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
