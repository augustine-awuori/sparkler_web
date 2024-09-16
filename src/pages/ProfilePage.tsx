import styled from "styled-components";
import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FeedUser } from "../contexts/ProfileContext";
import { useTitleChanger, useUsers } from "../hooks";
import { User } from "../users";
import service from "../services/users";
import LoadingIndicator from "../components/LoadingIndicator";
import { ProfileContext } from "../contexts";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileBio from "../components/profile/ProfileBio";
import TabList from "../components/profile/TabList";

export default function ProfilePage() {
  const { client } = useStreamContext();
  const [user, setUser] = useState<FeedUser>();
  const { user_id } = useParams();
  const { users } = useUsers();
  const navigate = useNavigate();
  useTitleChanger((user?.data as User)?.name || "User Profile");

  useEffect(() => {
    if (!user_id) return;

    const getUser = async () => {
      try {
        let userId = users[user_id];

        if (!userId) {
          const res = await service.getUserByUsername(user_id);
          if (res.ok) userId = (res.data as User)._id;
        }

        if (!userId) {
          toast.error("There's no user with the given username");
          return navigate(-1);
        }

        const user = await client
          ?.user(userId)
          .get({ with_follow_counts: true });

        if (user?.full) setUser(user.full);
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
