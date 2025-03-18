import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ProfileSparkles from "./ProfileSparkles";
import ProfileReplies from "./ProfileReplies";
import ProfileMedia from "./ProfileMedia";
import TabsList from "../TabsList";

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

export default function ProfileTabList() {
  const { username } = useParams();
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

  const handleTabChange = (tabId: TabId) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);

      navigate(`/${username}?tab=${tabs.find((t) => t.id === tabId)?.label}`);
    }
  };

  return (
    <div>
      <TabsList<TabId>
        activeTabId={activeTab}
        onTabClick={handleTabChange}
        tabs={tabs}
      />
      {activeTab === "sparkles" && <ProfileSparkles />}
      {activeTab === "sparkles-replies" && <ProfileReplies />}
      {activeTab === "media" && <ProfileMedia />}
    </div>
  );
}
