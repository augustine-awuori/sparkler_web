import classNames from "classnames";
import { useState } from "react";
import styled from "styled-components";

import ProfileSparkles from "./ProfileSparkles";
import ProfileReplies from "./ProfileReplies";

type TabId = "tweets" | "tweet-replies" | "media";

const tabs: { id: TabId; label: string }[] = [
  {
    id: "tweets",
    label: "Sparkles",
  },
  {
    id: "tweet-replies",
    label: "Sparkles & replies",
  },
  {
    id: "media",
    label: "Media",
  },
];

export default function TabList() {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

  return (
    <div>
      <Container>
        {tabs.map((tab) => (
          <button
            onClick={() => setActiveTab(tab.id)}
            className="tab"
            key={tab.id}
          >
            <span
              className={classNames(
                "tab__label",
                activeTab === tab.id && "active"
              )}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </Container>
      {activeTab === "tweets" && <ProfileSparkles />}
      {activeTab === "tweet-replies" && <ProfileReplies />}
    </div>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Equal horizontal space for each tab */
  border-bottom: 1px solid #555;
  width: 100%;

  .tab {
    color: #777;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 15px;
    flex: 1;

    &:hover {
      background-color: #111;
    }

    &__label {
      position: relative;
      width: 100%;
      text-align: center;
      padding: 20px 7px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.active {
        color: white;

        &::after {
          content: "";
          height: 3px;
          width: 100%;
          background-color: var(--theme-color);
          border-radius: 40px;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
`;
