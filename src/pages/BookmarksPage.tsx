import { Activity as MainActivity, Reaction } from "getstream";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { Activity, Comment } from "../utils/types";
import { Header } from "../components/home/MainHeader";
import { useSparkle, useTitleChanger } from "../hooks";
import reactionsService from "../services/reactions";
import sparklesService from "../services/sparkles";
import SparkleBlock from "../components/sparkle/SparkleBlock";
import LoadingIndicator from "../components/LoadingIndicator";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Array<Comment | Activity>>([]);
  const { hasBookmarked } = useSparkle();
  useTitleChanger("Bookmarks");

  useEffect(() => {
    const initBookmarks = async () => {
      setLoading(true);
      const res = await reactionsService.get("bookmark");
      if (res.ok) {
        const bookmarkReactions = (res.data as { results: Array<Reaction> })
          .results;
        const sparklesId = bookmarkReactions.map((r) => r.activity_id);
        const { data, ok } = await sparklesService.getSparkles(sparklesId);
        ok
          ? setActivities(data as Array<Comment | Activity>)
          : toast.error("Could not fecth bookmarks");

        setLoading(false);
      } else {
        toast.error("Error fetching bookmarks");
        setLoading(false);
      }
    };

    initBookmarks();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <Container>
      <div className="header">
        <Header>
          <h1>Bookmarks</h1>
        </Header>
      </div>

      {activities
        .filter((activity) =>
          activity.parent ? true : hasBookmarked(activity as Activity)
        )
        .map((activity) => {
          return activity.parent ? (
            <></>
          ) : (
            <SparkleBlock
              activity={activity as unknown as MainActivity}
              key={activity.id}
            />
          );
        })}
    </Container>
  );
}

const Container = styled.div`
  .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;
