import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useStreamContext } from "react-activity-feed";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

import {
  ProfileBio,
  ProfileHeader,
  ProfileTabList,
} from "../components/profile";
import { useProfile, useTitleChanger, useUser } from "../hooks";
import { User } from "../users";
import LoadingIndicator from "../components/LoadingIndicator";
import service from "../services/users";

export default function ProfilePage() {
  const { client } = useStreamContext();
  const { user, setUser } = useProfile();
  const { user: currentUser } = useUser();
  const { username } = useParams();
  const navigate = useNavigate();
  useTitleChanger(user?.data.name || "User Profile");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    const updateUserInfo = async () => {
      const userDetailsNeedUpdate =
        client?.userId === currentUser?._id &&
        username &&
        user &&
        client?.currentUser?.data?.name === "Unknown";

      if (userDetailsNeedUpdate) {
        const res = user?.data
          ? { ok: true, problem: "", data: user.data }
          : await service.getUserByUsername(username);

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
  }, [client, client?.currentUser, currentUser?._id, user, username]);

  useEffect(() => {
    if (!username) return navigate(-1);

    const initUser = async () => {
      let userId = user?.id;

      if (!userId) {
        const res = await service.getUserByUsername(username);

        if (!res.ok) {
          toast.error("Database didn't pick the call");
          return navigate(-1);
        }

        userId = (res.data as User)._id;
      }

      try {
        const fetchedUser = await client
          ?.user(userId)
          .get({ with_follow_counts: true });

        if (fetchedUser?.full)
          setUser({
            ...fetchedUser.full,
            data: { ...fetchedUser.full.data, ...user.data },
          });
      } catch (error) {
        if (client?.userId !== currentUser?._id) return;

        let fetchedUser: User | undefined = undefined;
        const res = await service.getUserByUsername(username);
        if (res.ok) fetchedUser = res.data as User;
        if (fetchedUser)
          client?.user(userId).getOrCreate({ ...fetchedUser, id: userId });
      }
    };

    initUser();
  }, [
    client,
    currentUser?._id,
    navigate,
    setUser,
    user.data,
    user?.id,
    username,
  ]);

  if (!client || !user) return <LoadingIndicator />;

  return (
    <>
      <Helmet>
        <title>{user.data.name}</title>
        <meta name="description" content={user.data.bio} />
        <meta name="og:description" content={user.data.bio} />
        <meta property="og:image" content={user.data.profileImage} />
        <link rel="canonical" href={`https://sparkler.lol/${username}`} />
      </Helmet>

      <Container>
        <ProfileHeader />
        <main>
          <ProfileBio />
          <div className="tab-list">
            <ProfileTabList />
          </div>
        </main>
      </Container>
    </>
  );
}

const Container = styled.div`
  --profile-image-size: 100px;
`;
