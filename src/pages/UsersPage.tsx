import { useEffect, useState } from "react";
import { Avatar } from "react-activity-feed";
import { Text } from "@chakra-ui/react";
import styled from "styled-components";

import { ANONYMOUS_USER_ID } from "../components/explore/WhoToFollow";
import { useProfileUser, useUser, useUsers } from "../hooks";
import { User } from "../users";
// import FollowBtn from "../components/FollowBtn";
import LoadingIndicator from "../components/LoadingIndicator";
import SearchInput from "../components/trends/SearchInput";
import TabsList, { Tab } from "../components/TabsList";
import Button from "../components/Button";
import UserAccounts from "../components/UserAccounts";

type TabId = "all" | "verified";

const tabs: Tab<TabId>[] = [
  { id: "all", label: "All" },
  { id: "verified", label: "Verified" },
];

const UsersPage = () => {
  const [activeTabId, setActiveTabId] = useState<TabId>(tabs[0].id);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { allUsers, isLoading } = useUsers();
  const { viewUserProfile } = useProfileUser();
  const { user } = useUser();

  useEffect(() => {
    function getVerifiedFirst(users: User[]): User[] {
      return users.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    function getValidUsers(users: User[]): User[] {
      return users
        .filter(({ _id }) => _id !== user?._id && _id !== ANONYMOUS_USER_ID)
        .filter((u) => !u.invalid);
    }

    async function filterUsersByTab() {
      let filtered = getVerifiedFirst(getValidUsers(allUsers));

      if (activeTabId === "verified") {
        filtered = filtered.filter((u) => u.verified);
      }

      if (query) {
        filtered = filtered.filter(({ name }) =>
          name.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredUsers(filtered);
    }

    filterUsersByTab();
  }, [activeTabId, allUsers, query, user?._id]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTabId(tabId);
    setQuery("");
  };

  return (
    <Container>
      <h1 className="heading">Users</h1>
      <TabsList
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
      />

      <div className="search-container">
        <SearchInput
          onQueryChange={setQuery}
          placeholder="Search Sparklers"
          query={query}
        />
      </div>

      {isLoading && !filteredUsers.length && <LoadingIndicator />}

      {filteredUsers.map((leader) => (
        <div className="user-container" key={leader._id}>
          <div className="user">
            <div
              onClick={() => viewUserProfile(leader)}
              className="user__details"
            >
              <Avatar circle image={leader.profileImage} size={40} />
              <div className="user__info">
                <Text noOfLines={1} className="user__name">
                  {leader.name}
                  {leader.verified && (
                    <img
                      src={
                        leader.isAdmin
                          ? require("../assets/admin.png")
                          : require("../assets/verified.png")
                      }
                      alt="Verified"
                      className="verified-icon"
                    />
                  )}
                </Text>
                <span className="user__id">@{leader.username}</span>
              </div>
            </div>
            {/* <FollowBtn userId={leader._id} /> */}
            <Button
              outline
              outlineText="Visit"
              blockText="Click"
              onClick={() => viewUserProfile(leader)}
            />
          </div>

          {leader.bio && (
            <Text noOfLines={2} fontSize="small" className="bio" color="#fff">
              {leader.bio}
            </Text>
          )}

          <UserAccounts user={{ data: leader }} />
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding-horizontal: 1rem;

  .heading {
    color: white;
    font-size: 16px;
    margin-left: 15px;
    margin-top: 1rem;
  }

  .search-container {
    margin: 0.5rem;
  }

  .user-container {
    border-bottom: 1px solid #333;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    padding: 7px 7px 0;

    &:hover {
      background-color: #2a2f35;
      border-radius: 8px;
      transform: scale(1.02);
    }
  }

  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user__details {
      display: flex;
      align-items: flex-start;
      flex-grow: 1;
      min-width: 0;

      .user__info {
        margin-left: 0.4rem;
        max-width: 100%;
        flex-grow: 1;
        min-width: 0;

        .user__name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .verified-icon {
            width: 16px;
            height: 16px;
            margin-left: 5px;
            flex-shrink: 0;
          }
        }

        .user__id {
          font-size: 12px;
          color: #657786;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      }
    }
  }
`;

export default UsersPage;
