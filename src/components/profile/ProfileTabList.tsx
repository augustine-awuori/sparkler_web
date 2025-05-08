import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useUsers } from "../../hooks";
import ProfileMedia from "./ProfileMedia";
import ProfileProducts from "./ProfileProducts";
import ProfileReplies from "./ProfileReplies";
import ProfileSparkles from "./ProfileSparkles";
import TabsList from "../TabsList";

export type TabId = "sparkles" | "sparkles-replies" | "media" | "products";

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
  {
    id: "products",
    label: "Products",
  },
];

export default function ProfileTabList() {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);
  const { username } = useParams();
  const { usernameIdMap, idUserMap } = useUsers();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabLabel = params.get("tab");

    const foundTab = tabs.find((tab) => tab.label === tabLabel);
    if (foundTab && activeTab !== foundTab.id) setActiveTab(foundTab.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tabId: TabId) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);

      navigate(`/${username}?tab=${tabs.find((t) => t.id === tabId)?.label}`);
    }
  };

  const getUserEmail = (): string =>
    idUserMap[usernameIdMap[username || ""]].email;

  const renderTab = () => {
    if (activeTab === "media") return <ProfileMedia />;
    if (activeTab === "sparkles") return <ProfileSparkles />;
    if (activeTab === "sparkles-replies") return <ProfileReplies />;
    if (activeTab === "products")
      return <ProfileProducts email={getUserEmail()} />;
  };

  return (
    <div>
      <TabsList<TabId>
        activeTabId={activeTab}
        onTabClick={handleTabChange}
        tabs={tabs}
      />
      {renderTab()}
    </div>
  );
}
