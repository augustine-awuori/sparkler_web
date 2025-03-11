import { useState } from "react";
import { Avatar } from "react-activity-feed";
import { useNavigate } from "react-router-dom";
import { BsInfo } from "react-icons/bs";
import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import styled from "styled-components";

import { Bookmark, User } from "../../assets/icons";
import { useAuth, useUser } from "../../hooks";

export default function MainHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();
  const { logout } = useAuth();
  const isMobileSize = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <Header>
        {isMobileSize ? (
          <>
            <Left>
              <Avatar
                image={user?.profileImage || ""}
                circle
                onClick={openDrawer}
                style={{ cursor: "pointer", width: 30, height: 30 }}
              />
            </Left>
            <Center>Sparkler</Center>
            <Right onClick={() => navigate(user ? "" : "/auth")}>
              {user ? "" : "Login"}
            </Right>
          </>
        ) : (
          <>
            <Left>Sparkler</Left>
            <Right onClick={() => navigate(user ? "" : "/auth")}>
              {user ? "" : "Login"}
            </Right>
          </>
        )}
      </Header>
      {isMobileSize && isDrawerOpen && (
        <>
          <Overlay onClick={closeDrawer} />
          <Drawer>
            <DrawerHeader>
              <AvatarWrapper>
                <Avatar
                  image={user?.profileImage || ""}
                  circle
                  style={{ width: 50, height: 50 }}
                />
              </AvatarWrapper>
              <UserInfo>
                <Username>
                  <Flex align="center">
                    {user?.name || "Unknown"}{" "}
                    {user?.verified && (
                      <Image
                        src={require("../../assets/verified.png")}
                        w={3}
                        h={3}
                        ml={1}
                      />
                    )}
                  </Flex>
                </Username>
                <Handle>@{user?.username || "unknown"}</Handle>
                <FollowStats>
                  <span>0 Following</span>
                  <span>0 Followers</span>
                </FollowStats>
              </UserInfo>
              <CloseButton onClick={closeDrawer}>×</CloseButton>
            </DrawerHeader>
            <DrawerContent>
              <NavItem>
                <Flex
                  align="center"
                  onClick={() => navigate(user ? `/${user.username}` : "/")}
                >
                  <User color="#fff" /> <Text ml={4}>Profile</Text>
                </Flex>
              </NavItem>
              <NavItem>
                <Flex
                  align="center"
                  onClick={() =>
                    navigate(user ? `/${user.username}/bookmarks` : "/")
                  }
                >
                  <Bookmark color="#fff" /> <Text ml={4}>Bookmarks</Text>
                </Flex>
              </NavItem>
              <NavItem>
                <Flex
                  align="center"
                  onClick={() => navigate("/sparkler/about")}
                >
                  <BsInfo size={25} /> <Text ml={4}>About Sparkler</Text>
                </Flex>
              </NavItem>
            </DrawerContent>
            <LogoutButton onClick={() => (user ? logout() : navigate("/auth"))}>
              {user ? "LOGOUT" : "LOGIN"}
            </LogoutButton>
          </Drawer>
        </>
      )}
    </>
  );
}

export const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 15px;
  color: white;
  width: 100%;
  font-weight: bold;
  backdrop-filter: blur(2px);
  background-color: rgba(20, 20, 20, 0.9);
`;

const Left = styled.div`
  flex: 1;
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Right = styled.div`
  flex: 1;
  text-align: right;
  cursor: pointer;
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 280px;
  background: #121212;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.6);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 0 10px 10px 0;
  color: white;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
`;

const AvatarWrapper = styled.div`
  flex-shrink: 0;
  margin-bottom: 0.9rem;
`;

const UserInfo = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const Username = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Handle = styled.div`
  font-size: 14px;
  color: #bbb;
`;

const FollowStats = styled.div`
  font-size: 12px;
  color: #ddd;
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: white;
  cursor: pointer;
  margin-left: auto;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: #ff4757;
  }
`;

const DrawerContent = styled.div`
  flex: 1;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavItem = styled.div`
  font-size: 16px;
  padding: 12px 16px;
  cursor: pointer;
  color: #ddd;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    color: #bbb;
  }
`;

const LogoutButton = styled.button`
  background: var(--primary-color);
  border-radius: 26px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 3rem;
  padding: 15px;
  text-align: center;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;
