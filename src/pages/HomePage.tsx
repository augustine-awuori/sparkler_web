import styled from "styled-components";
import { Feed } from "react-activity-feed";

import { useTitleChanger } from "../hooks";
import MainHeader from "../components/home/MainHeader";
import CreateSparkleTop from "../components/home/CreateSparkleTop";
import Timeline from "../components/home/Timeline";

export default function HomePage() {
  useTitleChanger("Home");

  return (
    <Container>
      <div className="header">
        <MainHeader />
      </div>
      <Feed feedGroup="user">
        <div className="create-tweet-top">
          <CreateSparkleTop />
        </div>
        <Timeline />
      </Feed>
    </Container>
  );
}

const Container = styled.div`
  .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .create-tweet-top {
    border-bottom: 1px solid #333;
  }

  .new-tweets-info {
    border-bottom: 1px solid #333;
    padding: 20px;
    text-align: center;
    color: var(--theme-color);
    display: block;
    width: 100%;
    font-size: 16px;

    &:hover {
      background: #111;
    }
  }
`;
