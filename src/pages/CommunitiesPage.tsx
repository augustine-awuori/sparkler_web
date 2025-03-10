import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserGroup, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Community } from "../contexts/CommunitiesContext";
import { CommunityCard, CreateCommunityModal } from "../components/community";
import { useCommunities } from "../hooks";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const helper = useCommunities();
  const navigate = useNavigate();

  const filteredCommunities = helper.communities?.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setUserCommunities(helper.getUserCommunities());
  }, [helper]);

  const handleCreateCommunity = async (name: string, bio: string) => {
    try {
      const res = await helper.createCommunity({ name, bio });
      if (res.ok) {
        toast.success("Community created successfully!");
        helper.addCommunity(res.data as Community);
        const updatedUserCommunities = helper.getUserCommunities();
        setUserCommunities(updatedUserCommunities || []);
        setIsModalOpen(false);
      } else toast.error("Failed to create community!");
    } catch (error) {
      toast.error("An error occurred while creating the community.");
    }
  };

  return (
    <PageContainer>
      <MainContent>
        <Header>
          <HeaderTitleContainer>
            <HeaderTitle>Communities</HeaderTitle>
            <CreateButton onClick={() => setIsModalOpen(true)}>
              <FaUserGroup size={16} />
              <FaPlus size={14} />
            </CreateButton>
          </HeaderTitleContainer>
        </Header>

        {userCommunities.length > 0 && (
          <UserCommunitiesSection>
            <UserCommunitiesList>
              {userCommunities.map((community) => (
                <UserCommunityCard
                  key={community._id}
                  onClick={() => navigate(community._id)}
                >
                  <UserCommunityImage
                    src={
                      community.profileImage || require("../assets/group.jpg")
                    }
                    alt={`${community.name} profile`}
                  />
                  <UserCommunityName>{community.name}</UserCommunityName>
                </UserCommunityCard>
              ))}
            </UserCommunitiesList>
          </UserCommunitiesSection>
        )}

        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBarContainer>

        <Categories>
          <CategoryButton>All</CategoryButton>
          <CategoryButton>Technology</CategoryButton>
          <CategoryButton>Gaming</CategoryButton>
          <CategoryButton>Music</CategoryButton>
          <CategoryButton>Art</CategoryButton>
        </Categories>

        <CommunityList>
          {filteredCommunities?.length > 0 ? (
            filteredCommunities.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))
          ) : (
            <NoResults>No communities found.</NoResults>
          )}
        </CommunityList>
      </MainContent>

      <CreateCommunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCommunity}
      />
    </PageContainer>
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

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  color: ${theme.textColor};
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: #000;
  padding: 10px 0;
  z-index: 10;
  border-bottom: 1px solid ${theme.borderColor};
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.textColor};
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: ${theme.primaryColor};
  color: ${theme.textColor};
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.primaryHoverColor};
  }

  svg {
    margin-right: 5px;
  }
`;

const UserCommunitiesSection = styled.div`
  margin: 20px 0;
`;

const UserCommunitiesList = styled.div`
  display: flex;
  gap: 15px; /* Increased gap for better spacing */
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on mobile */
`;

const UserCommunityCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px; /* Increased width to match X.com card size */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow on hover */
  }
`;

const UserCommunityImage = styled.img`
  width: 140px; /* Match card width */
  height: 80px; /* Adjusted height for rectangular shape */
  border-radius: 10px; /* Slightly rounded corners */
  object-fit: cover;
  margin-bottom: 5px;
  border: 1px solid ${theme.borderColor};
`;

const UserCommunityName = styled.span`
  font-size: 0.9rem;
  color: ${theme.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  padding: 0 5px; /* Added padding for better text alignment */
`;

const SearchBarContainer = styled.div`
  margin: 15px 0;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid ${theme.borderColor};
  background: transparent;
  color: ${theme.textColor};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${theme.primaryColor};
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  overflow-x: auto;
  white-space: nowrap;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.borderColor};
  border-radius: 20px;
  color: ${theme.textColor};
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CommunityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: ${theme.grayColor};
  font-size: 1rem;
`;
