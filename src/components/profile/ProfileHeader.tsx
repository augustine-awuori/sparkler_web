import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useProfile } from "../../hooks";
import ArrowLeft from "../icons/ArrowLeft";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  coverImage?: string;
}

export default function ProfileHeader() {
  const navigate = useNavigate();
  const { user } = useProfile();
  const { client } = useStreamContext();
  const [activitiesCount, setActivitiesCount] = useState(0);

  useEffect(() => {
    const userFeed = client?.feed("user", user?.id);

    async function getActivitiesCount() {
      const activities = await userFeed?.get();

      if (activities) setActivitiesCount(activities.results.length);
    }

    getActivitiesCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const navigateBack = () => {
    navigate(-1);
  };

  if (!user) return <Navigate to="/" />;

  return (
    <>
      <StickyHeader>
        <button onClick={navigateBack}>
          <ArrowLeft size={20} color="white" />
        </button>
        <div className="info">
          <h1>{(user?.data).name || "Display user name here"}</h1>
          <span className="info__tweets-count">
            {activitiesCount} Sparkle{activitiesCount === 1 ? "" : "s"}
          </span>
        </div>
      </StickyHeader>
      <Header>
        <div className="cover">
          <img
            src={user.data.coverImage || "https://picsum.photos/500/200"}
            alt="cover"
          />
        </div>
      </Header>
    </>
  );
}

const StickyHeader = styled.div`
  align-items: center;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  padding: 10px 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;

  .info {
    margin-left: 30px;

    h1 {
      font-size: 20px;
    }

    &__tweets-count {
      font-size: 14px;
      margin-top: 2px;
      color: #888;
    }
  }
`;

const Header = styled.header`
  .cover {
    width: 100%;
    background-color: #555;
    height: 150px;
    overflow: hidden;

    img {
      width: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`;
