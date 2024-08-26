import { ReactNode, useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import LeftSide from "./LeftSide";
import CreateTweetDialog from "./sparkle/CreateSparkleDialog";
import RightSide from "./RightSide";
import LoadingIndicator from "./LoadingIndicator";
import BottomNav from "./nav/BottomNav";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useStreamContext();
  const [createDialogOpened, setCreateDialogOpened] = useState(false);
  const [hideRightSide, setHideRightSide] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setHideRightSide(
      location.pathname === "/explore" ||
        location.pathname.startsWith("/messages")
    );
  }, [location.pathname]);

  const showLeftSidebar = useBreakpointValue({ base: false, md: true });
  const showRightSidebar =
    useBreakpointValue({ base: false, lg: true }) && !hideRightSide;

  if (!user) return <LoadingIndicator />;

  return (
    <>
      {createDialogOpened && (
        <CreateTweetDialog
          onClickOutside={() => setCreateDialogOpened(false)}
        />
      )}
      <Container>
        <Box className="content">
          {showLeftSidebar && (
            <Box className="left-side-bar">
              <LeftSide onClickSparkle={() => setCreateDialogOpened(true)} />
            </Box>
          )}
          <Box as="main" className="main-content">
            {!user ? <LoadingIndicator /> : children}
            <BottomNav />
          </Box>
          {showRightSidebar && (
            <Box className="right-side-bar">
              <RightSide />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: black;

  .content {
    max-width: 1300px;
    margin: 0 auto;
    width: 100%;
    display: flex;
  }

  .left-side-bar {
    height: 100vh;
    width: 240px;
    position: sticky;
    top: 0;
  }

  .main-content {
    position: relative;
    width: 100%;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    min-height: 100vh;
    padding-bottom: 56px;
  }

  .right-side-bar {
    width: 300px;
  }
`;
