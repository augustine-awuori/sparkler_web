import styled from "styled-components";
import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FeedUser } from "../../contexts/ProfileContext";
import { ProfileContext } from "../../contexts";
import { User } from "../../users";
import ProfileHeader from "./ProfileHeader";
import LoadingIndicator from "../LoadingIndicator";
import ProfileBio from "./ProfileBio";
import service from "../../services/users";
import TabList from "./TabList";

export default function ProfileContent() {
  const { client } = useStreamContext();
  const [user, setUser] = useState<FeedUser>();
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) return;

    const getUser = async () => {
      try {
        const res = await service.getUserByUsername(user_id);
        if (res.ok) {
          const user = await client
            ?.user((res.data as User)._id)
            .get({ with_follow_counts: true });

          if (user?.full) setUser(user.full);
        } else {
          toast.error("There's no user with the given username");
          navigate(-1);
        }
      } catch (error) {}
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  if (!client || !user) return <LoadingIndicator />;

  return (
    <ProfileContext.Provider value={{ user, setUser }}>
      <Container>
        <ProfileHeader />
        <main>
          <ProfileBio />
          <div className="tab-list">
            <TabList />
          </div>
        </main>
      </Container>
    </ProfileContext.Provider>
  );
}

const Container = styled.div`
  --profile-image-size: 100px;
`;
