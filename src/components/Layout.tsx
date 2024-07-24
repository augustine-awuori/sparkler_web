import { ReactNode, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import styled from "styled-components";
import { Box, useBreakpointValue } from "@chakra-ui/react";

import LeftSide from "./LeftSide";
import CreateTweetDialog from "./sparkle/CreateSparkleDialog";
import RightSide from "./RightSide";
import LoadingIndicator from "./LoadingIndicator";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useStreamContext();
  const [createDialogOpened, setCreateDialogOpened] = useState(false);

  const showLeftSidebar = useBreakpointValue({ base: false, md: true });
  const showRightSidebar = useBreakpointValue({ base: false, lg: true });

  if (!user) return <LoadingIndicator />;

  return (
    <>
      {createDialogOpened && (
        <CreateTweetDialog
          onClickOutside={() => setCreateDialogOpened(false)}
        />
      )}
      <Container>
        <div className="content">
          {showLeftSidebar && (
            <Box className="left-side-bar">
              <LeftSide onClickSparkle={() => setCreateDialogOpened(true)} />
            </Box>
          )}
          <main className="main-content">
            {!user ? <LoadingIndicator /> : children}
          </main>
          {showRightSidebar && (
            <Box className="right-side-bar">
              <RightSide />
            </Box>
          )}
        </div>
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
  }

  .right-side-bar {
    width: 300px;
  }
`;
