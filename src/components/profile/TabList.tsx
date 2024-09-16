import classNames from "classnames";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import ProfileSparkles from "./ProfileSparkles";
import ProfileReplies from "./ProfileReplies";
import ProfileMedia from "./ProfileMedia";

export type TabId = "sparkles" | "sparkles-replies" | "media";

type Tab = { id: TabId; label: string };

const tabs: Tab[] = [
  {
    id: "sparkles",
    label: "Sparkles",
  },
  {
    id: "sparkles-replies",
    label: "Resparkles & replies",
  },
  {
    id: "media",
    label: "Media",
  },
];

export default function TabList() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabLabel = params.get("tab");

    const foundTab = tabs.find((tab) => tab.label === tabLabel);
    if (foundTab && activeTab !== foundTab.id) setActiveTab(foundTab.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tab: Tab) => {
    if (activeTab !== tab.id) {
      setActiveTab(tab.id);
      navigate(`/${user_id}?tab=${tab.label}`);
    }
  };

  return (
    <div>
      <Container>
        {tabs.map((tab) => (
          <button
            onClick={() => handleTabChange(tab)}
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
      {activeTab === "sparkles" && <ProfileSparkles />}
      {activeTab === "sparkles-replies" && <ProfileReplies />}
      {activeTab === "media" && <ProfileMedia />}
    </div>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
