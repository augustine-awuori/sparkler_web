import { useEffect, useState } from "react";
import { Image } from "@chakra-ui/react"; // Added Spinner
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Community } from "../../contexts/CommunitiesContext";
import { useCommunities, useUser } from "../../hooks";
import JoinButton from "./JoinButton";

export default function CommunityCard({ community }: { community: Community }) {
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const { addMember, hasMember, joinCommunity } = useCommunities();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMember = (): boolean => {
      if (!user) return false;

      return hasMember(user._id, community._id);
    };

    setJoined(checkMember());
  }, [community._id, hasMember, user]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return toast.info("Login to join community");
    if (joined || joining) return;

    setJoining(true);
    const res = await joinCommunity(communityId);
    setJoining(false);

    if (res.ok) {
      toast.success("You are now a member");
      addMember(communityId);
    } else toast.error("Could not joined! Something failed");
  };

  return (
    <Card onClick={() => navigate(community._id)}>
      <CommunityImage
        src={community.profileImage || require("../../assets/group.jpg")}
        alt={`${community.name} profile`}
      />
      <CommunityInfo>
        <CommunityName>
          {community.name}
          {community.isVerified && (
            <Image
              w={4}
              h={4}
              alt="verified"
              src={require("../../assets/verified.png")}
            />
          )}
        </CommunityName>
        <CommunityBio>{community.bio || "No bio available."}</CommunityBio>
        <CommunityMembers>{community.members.length} members</CommunityMembers>
      </CommunityInfo>
      <JoinButton
        joined={joined}
        onClick={() => handleJoinCommunity(community._id)}
        joining={joining}
      />
    </Card>
  );
}

const theme = {
  primaryColor: "var(--primary-color)",
  primaryHoverColor: "var(--primary-hover-color)",
  backgroundColor: "var(--background-color)",
  borderColor: "var(--border-color)",
  textColor: "var(--text-color)",
  grayColor: "var(--gray-color)",
};

const Card = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  border: 1px solid ${theme.borderColor};
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CommunityImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const CommunityInfo = styled.div`
  flex: 1;
`;

const CommunityName = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CommunityBio = styled.p`
  font-size: 0.9rem;
  color: ${theme.grayColor};
  margin: 5px 0;
`;

const CommunityMembers = styled.p`
  font-size: 0.85rem;
  color: ${theme.grayColor};
`;
