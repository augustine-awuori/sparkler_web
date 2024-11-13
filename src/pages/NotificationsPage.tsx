import { useState } from "react";
import { LoadMorePaginator, NotificationFeed } from "react-activity-feed";
import styled from "styled-components";

import { NotificationGroup } from "../components/notifications";
import { useTitleChanger } from "../hooks";
import LoadingIndicator from "../components/LoadingIndicator";
import LoadMoreButton from "../components/LoadMoreButton";
import TabsList from "../components/TabsList";

type TabId = "all" | "mentions";

type Tab = { id: TabId; label: string };

const tabs: Tab[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "mentions",
    label: "Mentions",
  },
];

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);
  useTitleChanger("Notifications");

  return (
    <Container>
      <h1 className="heading">Notifications</h1>

      <TabsList<TabId>
        tabs={tabs}
        activeTabId={activeTab}
        onTabClick={setActiveTab}
      />

      <NotificationFeed
        Group={NotificationGroup}
        LoadingIndicator={LoadingIndicator}
        Paginator={(props) => (
          <LoadMorePaginator
            {...props}
            LoadMoreButton={(props) => <LoadMoreButton {...props} />}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.div`
  .heading {
    padding: 15px;
    font-size: 16px;
    color: white;
  }

  .tab-list {
    margin-top: 10px;
    border-bottom: 1px solid #333;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .tab {
      color: #777;
      padding: 0 35px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 15px;

      &:hover {
        background-color: #111;
      }

      &__label {
        position: relative;
        padding: 20px 30px;

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
  }
`;
