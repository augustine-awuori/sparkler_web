import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useStreamContext } from "react-activity-feed";
import { Activity } from "getstream";
import styled from "styled-components";

import LoadingIndicator from "../components/LoadingIndicator";
import SparkleBlock from "../components/sparkle/SparkleBlock";
import SearchInput from "../components/trends/SearchInput";

const HashtagPage = () => {
  const [hashtags, setHashtags] = useState<Activity[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { client } = useStreamContext();
  const { hashtag } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (hashtag) setQuery(hashtag);

    const fetchHashtags = async () => {
      setLoading(true);
      const hashtagsFeed = client?.feed("hashtags", hashtag);
      const response = await hashtagsFeed?.get({
        ownReactions: true,
        withReactionCounts: true,
      });
      setLoading(false);

      if (response) setHashtags(response.results as unknown as Activity[]);
    };

    fetchHashtags();
  }, [client, hashtag]);

  const handleQuery = () => navigate(`/explore/${query.toLowerCase()}`);

  if (!hashtag) return <Navigate to="/" />;

  return (
    <>
      <InputContainer>
        <SearchInput
          onQueryChange={setQuery}
          query={query}
          onEnter={handleQuery}
        />
      </InputContainer>

      {isLoading && <LoadingIndicator />}

      {hashtags.map((activity) => (
        <SparkleBlock key={activity.id} activity={activity} />
      ))}
    </>
  );
};

const InputContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  padding-left: 10px;
  padding-right: 10px;
`;

export default HashtagPage;
