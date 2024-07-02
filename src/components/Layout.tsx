import { ReactNode, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import styled from "styled-components";

import LeftSide from "./LeftSide";
import CreateTweetDialog from "./sparkle/CreateSparkleDialog";
import RightSide from "./RightSide";
import LoadingIndicator from "./LoadingIndicator";

const Container = styled.div`
  min-height: 100vh;
  background: black;
  --left: 250px;
  --right: 300px;
  --middle: calc(100% - var(--left) - var(--right));

  .content {
    max-width: 1300px;
    margin: 0 auto;
    width: 100%;
    display: flex;
  }

  .left-side-bar {
    height: 100vh;
    width: var(--left);
    position: sticky;
    top: 0;
  }

  .main-content {
    position: relative;
    width: var(--middle);
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    min-height: 100vh;
  }

  .right-side-bar {
    width: var(--right);
  }
`;

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useStreamContext();
  const [createDialogOpened, setCreateDialogOpened] = useState(false);

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
          <div className="left-side-bar">
            <LeftSide onClickSparkle={() => setCreateDialogOpened(true)} />
          </div>
          <main className="main-content">
            {!user ? <LoadingIndicator /> : children}
          </main>
          <div className="right-side-bar">
            <RightSide />
          </div>
          <div />
        </div>
      </Container>
    </>
  );
}
