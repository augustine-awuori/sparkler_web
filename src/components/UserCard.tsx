import React from "react";
import styled from "styled-components";
import { Avatar } from "react-activity-feed";

import { User } from "../users";
import SparkleActorName from "./sparkle/SparkleActorName";
import FollowButton from "./FollowButton";

interface Props {
  user: User;
}

const UserCard: React.FC<Props> = ({ user }) => {
  const { bio, profileImage, coverImage, _id } = user;

  return (
    <CardContainer>
      <CoverImage src={coverImage || require("../assets/cover-image.jpg")} />
      <Content>
        <StyledAvatar image={profileImage} size={64} circle />
        <InfoAndButton>
          <UserInfo>
            <SparkleActorName
              {...user}
              time={new Date(user.timestamp).toISOString()}
              id={_id}
              showTime={false}
            />
          </UserInfo>
          <FollowButton userId={_id} />
        </InfoAndButton>
        {bio && (
          <BioContainer>
            <Bio>{bio}</Bio>
          </BioContainer>
        )}
      </Content>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.8rem;
  overflow: hidden;
  width: 100%;
`;

const CoverImage = styled.div<{ src?: string }>`
  height: 100px;
  background-image: url(${(props) => props.src});
  background-color: var(--light-gray);
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  position: relative;
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

const StyledAvatar = styled(Avatar)`
  border-radius: 50%;
  border: 2px solid var(--background-color);
  position: absolute;
  top: -32px;
  left: 12px;
  object-fit: cover;
`;

const InfoAndButton = styled.div`
  margin-left: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: calc(100% - 88px);
  padding-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const BioContainer = styled.div`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: 6px;
`;

const Bio = styled.div`
  color: var(--text-color);
  font-size: 14px;
  line-height: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

export default UserCard;
