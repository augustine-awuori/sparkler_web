import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useProfile } from "../../hooks";
import ArrowLeft from "../icons/ArrowLeft";
import { unknown } from "zod";

const Header = styled.header`
  .top {
    display: flex;
    align-items: center;
    padding: 15px;
    color: white;
    width: 100%;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.5);

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
  }

  .cover {
    width: 100%;
    background-color: #555;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`;

export interface ProfileUser {
  name: string;
  email: string;
  profileImage?: string;
}

export default function ProfileHeader() {
  const navigate = useNavigate();
  const { user } = useProfile();
  const { client } = useStreamContext();

  const [activitiesCount, setActivitiesCount] = useState(0);

  useEffect(() => {
    const feed = client?.feed("user", user?.id);

    async function getActivitiesCount() {
      const activities = await feed?.get();

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
    <Header>
      <div className="top">
        <button onClick={navigateBack}>
          <ArrowLeft size={20} color="white" />
        </button>
        <div className="info">
          <h1>
            {(user?.data as unknown as ProfileUser).name ||
              "Display user name here"}
          </h1>
          <span className="info__tweets-count">{activitiesCount} Sparkles</span>
        </div>
      </div>
      <div className="cover">
        <img src="https://picsum.photos/500/200" alt="" />
      </div>
    </Header>
  );
}
