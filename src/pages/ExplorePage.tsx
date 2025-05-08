import { useState } from "react";
import styled from "styled-components";

import { CommunityCard } from "../components/community";
import { useCommunities, useUsers } from "../hooks";
import Trends from "../components/trends";
import SearchInput from "../components/trends/SearchInput";
import TabsList, { Tab } from "../components/TabsList";
import UserCard from "../components/UserCard";
import Categories from "../components/Categories";
import CategoryButton from "../components/CategoryButton";

type TabId = "Hashtags" | "Sparklers" | "Communities";
type Category = "All" | "Verified" | "Unverified";

const tabs: Tab<TabId>[] = [
  { id: "Hashtags", label: "Hashtags" },
  { id: "Sparklers", label: "Sparklers" },
  { id: "Communities", label: "Communities" },
];

export default function ExplorePage() {
  const [communitiesQuery, setCommunitiesQuery] = useState("");
  const [usersQuery, setUsersQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("Hashtags");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { communities } = useCommunities();
  const { allUsers } = useUsers();

  const renderContent = (): JSX.Element => {
    if (activeTab === "Communities") {
      const filteredCommunities = communities.filter((community) =>
        community.name.toLowerCase().includes(communitiesQuery.toLowerCase())
      );

      return (
        <>
          <SearchInput
            onQueryChange={setCommunitiesQuery}
            query={communitiesQuery}
            placeholder="Search Communities"
          />
          <GridContainer>
            {filteredCommunities.map((community) => (
              <CommunityCard community={community} key={community._id} />
            ))}
          </GridContainer>
        </>
      );
    } else if (activeTab === "Hashtags")
      return (
        <>
          <Categories>
            <CategoryButton
              $isActive={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            >
              All
            </CategoryButton>
            <CategoryButton
              $isActive={activeCategory === "Verified"}
              onClick={() => setActiveCategory("Verified")}
            >
              Verified
            </CategoryButton>
          </Categories>
          <GridContainer>
            <Trends
              query={usersQuery}
              verified={activeCategory === "Verified" ? true : undefined}
            />
          </GridContainer>
        </>
      );

    const sortedUsers = [...allUsers].sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });

    const filteredUsers = sortedUsers.filter(
      (user) =>
        (user.username.toLowerCase().includes(usersQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(usersQuery.toLowerCase())) &&
        user.username !== "awuori"
    );

    return (
      <>
        <SearchInput onQueryChange={setUsersQuery} query={usersQuery} />
        <GridContainer>
          {filteredUsers.map((user) => (
            <UserCard user={user} key={user._id} />
          ))}
        </GridContainer>
      </>
    );
  };

  return (
    <Container>
      <TabsList<TabId>
        activeTabId={activeTab}
        onTabClick={setActiveTab}
        tabs={tabs}
      />
      <MainLayout>
        <ContentWrapper>{renderContent()}</ContentWrapper>
      </MainLayout>
    </Container>
  );
}

const theme = {
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

const Container = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  height: auto;
  box-sizing: border-box;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  max-width: 1200px;
  margin: 1rem auto 0;
  width: 100%;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  width: 100%;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;
