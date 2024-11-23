import { PropsWithChildren, useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import BottomNav from "./nav/BottomNav";
import CreateTweetDialog from "./sparkle/CreateSparkleDialog";
import LeftSide from "./LeftSide";
import LoadingIndicator from "./LoadingIndicator";
import RightSide from "./RightSide";

export default function Layout({ children }: PropsWithChildren) {
  const { user } = useStreamContext();
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
      <CreateTweetDialog />

      <Container>
        <Box className="content">
          {showLeftSidebar && (
            <Box className="left-side-bar">
              <LeftSide />
            </Box>
          )}

          <Box as="main" className="main-content">
            {children}
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
    border-right: 1px solid #333;
    min-height: 100vh;
    padding-bottom: 56px;
  }

  .right-side-bar {
    width: 300px;
  }
`;
