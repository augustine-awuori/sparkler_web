import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "react-activity-feed";
import { Text } from "@chakra-ui/react";
import styled from "styled-components";

import { ANONYMOUS_USER_ID } from "../components/explore/WhoToFollow";
import { getProfileUserDataFromUserInfo } from "../utils/funcs";
import { useProfile, useUser, useUsers } from "../hooks";
import { User } from "../users";
import FollowBtn from "../components/FollowBtn";
import LoadingIndicator from "../components/LoadingIndicator";
import SearchInput from "../components/trends/SearchInput";
import TabsList, { Tab } from "../components/TabsList";
import verificationIcon from "../assets/verified.svg";

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
  const { setUser } = useProfile();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    function getVerifiedFirst(users: User[]): User[] {
      return users.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    function getValidUsers(users: User[]): User[] {
      return users.filter(
        ({ _id }) => _id !== user?._id && _id !== ANONYMOUS_USER_ID
      );
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

  const navigateToProfile = (leader: User) => {
    setUser(getProfileUserDataFromUserInfo(leader));
    navigate(`/${leader.username}`);
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
          placeholder="Search sparklers"
          query={query}
        />
      </div>

      {isLoading && !filteredUsers.length && <LoadingIndicator />}

      {filteredUsers.map((leader) => (
        <div className="user" key={leader._id}>
          <div
            onClick={() => navigateToProfile(leader)}
            className="user__details"
          >
            <div className="user__img">
              <Avatar image={leader.profileImage} />
            </div>
            <div className="user__info">
              <Text noOfLines={1} className="user__name">
                {leader.name}
                {leader.verified && (
                  <img
                    src={verificationIcon}
                    alt="Verified"
                    className="verified-icon"
                  />
                )}
              </Text>
              <span className="user__id">@{leader.username}</span>
            </div>
          </div>
          <FollowBtn userId={leader._id} />
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

  .user {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 5px 8px;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #2a2f35;
      transform: scale(1.02);
    }

    .user__details {
      display: flex;
      align-items: center;
      flex-grow: 1;
      min-width: 0;

      .user__img {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
        object-fit: cover;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user__info {
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
`;

export default UsersPage;
