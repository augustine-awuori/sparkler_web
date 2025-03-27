import styled from "styled-components";

import { ReportForm, ReportList } from "../components/report";
import { useState } from "react";
import { useUser } from "../hooks";
import TabsList from "../components/TabsList";

type TabId = "new" | "all";

type Tab = { id: TabId; label: string };

const tabs: Tab[] = [
  {
    id: "new",
    label: "New",
  },
  {
    id: "all",
    label: "All",
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("new");
  const { user } = useUser();

  const renderContent = () => {
    if (activeTab === "new") return <ReportForm />;
    else if (activeTab === "all") return <ReportList />;
    return null;
  };

  return (
    <PageWrapper>
      <Title>Reports</Title>

      {(user?.isSchOfficial || user?.isAdmin) && (
        <TabsList<TabId>
          activeTabId={activeTab}
          onTabClick={setActiveTab}
          tabs={tabs}
        />
      )}

      <ContentWrapper>{renderContent()}</ContentWrapper>
    </PageWrapper>
  );
}

const ContentWrapper = styled.div`
  padding: 0 1rem;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  color: var(--text-color);
`;

const Title = styled.h1`
  margin: 0.5rem 0.7rem 0;
  font-size: 1.1rem;
  font-weight: bold;
`;
