import styled from "styled-components";
import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useParams } from "react-router-dom";

import { FeedUser } from "../contexts/ProfileContext";
import { ProfileContext } from "../contexts";
import ProfileHeader from "./ProfileHeader";
import LoadingIndicator from "../LoadingIndicator";
import ProfileBio from "./ProfileBio";
import TabList from "./TabList";
import ProfileTweets from "./ProfileSparkles";

const Container = styled.div`
  --profile-image-size: 120px;

  .tab-list {
    margin-top: 30px;
  }
`;

export default function ProfileContent() {
  const { client } = useStreamContext();
  const [user, setUser] = useState<FeedUser>();
  const { user_id } = useParams();

  useEffect(() => {
    if (!user_id) return;

    const getUser = async () => {
      const user = await client
        ?.user(user_id)
        .get({ with_follow_counts: true });

      if (user?.full) setUser(user.full);
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
          <ProfileTweets />
        </main>
      </Container>
    </ProfileContext.Provider>
  );
}
