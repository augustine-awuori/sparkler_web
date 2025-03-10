import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "react-activity-feed";
import { useNavigate } from "react-router-dom";
import { useBreakpointValue } from "@chakra-ui/react";

import { useUser } from "../../hooks";

export default function MainHeader() {
  const { user } = useUser();
  const navigate = useNavigate();
  const isMobileSize = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            <Right onClick={() => navigate("/auth")}>Login</Right>
          </>
        ) : (
          <>
            <Left>Sparkler</Left>
            <Right onClick={() => navigate("/auth")}>Login</Right>
          </>
        )}
      </Header>
      {isMobileSize && isDrawerOpen && (
        <>
          <Overlay onClick={closeDrawer} />
          <Drawer>
            <DrawerHeader>
              <CloseButton onClick={closeDrawer}>×</CloseButton>
            </DrawerHeader>
            <DrawerContent>
              <p>Drawer content goes here.</p>
            </DrawerContent>
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
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 250px;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background: #f1f1f1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const DrawerContent = styled.div`
  padding: 20px;
  flex: 1;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;
