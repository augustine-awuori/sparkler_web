import styled from "styled-components";
import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FeedUser } from "../contexts/ProfileContext";
import { ProfileContext } from "../contexts";
import { User } from "../users";
import { useTitleChanger, useUser, useUsers } from "../hooks";
import LoadingIndicator from "../components/LoadingIndicator";
import ProfileBio from "../components/profile/ProfileBio";
import ProfileHeader from "../components/profile/ProfileHeader";
import service from "../services/users";
import TabList from "../components/profile/TabList";

export default function ProfilePage() {
  const { client } = useStreamContext();
  const [user, setUser] = useState<FeedUser>();
  const { user_id: user_username } = useParams();
  const { users } = useUsers();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  useTitleChanger((user?.data as User)?.name || "User Profile");

  useEffect(() => {
    const updateUserInfo = async () => {
      const userDetailsNeedUpdate =
        client?.userId === currentUser?._id &&
        user_username &&
        user &&
        client?.currentUser?.data?.name === "Unknown";

      if (userDetailsNeedUpdate) {
        const res = await service.getUserByUsername(user_username);

        if (res.ok) {
          const userData = {
            ...(res.data as User),
            id: (res.data as User)._id,
          };

          try {
            await client?.currentUser?.update(userData);
            window.location.reload();
          } catch (error) {}
        }
      }
    };

    updateUserInfo();
  }, [client, client?.currentUser, currentUser?._id, user, user_username]);

  useEffect(() => {
    if (!user_username) return navigate(-1);

    const getUser = async () => {
      let userId = users[user_username];

      if (!userId) {
        const res = await service.getUserByUsername(user_username);
        if (res.ok) userId = (res.data as User)._id;
      }

      if (!userId) {
        toast.error("There's no user with the given username");
        return navigate(-1);
      }

      try {
        const user = await client
          ?.user(userId)
          .get({ with_follow_counts: true });

        if (user?.full) setUser(user.full);
      } catch (error) {
        if (client?.userId !== currentUser?._id) return;

        let fetchedUser: User | undefined = undefined;
        const res = await service.getUserByUsername(user_username);
        if (res.ok) fetchedUser = res.data as User;
        if (fetchedUser)
          client?.user(userId).getOrCreate({ ...fetchedUser, id: userId });
      }
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_username]);

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
