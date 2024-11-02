import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FlatFeed, LoadMorePaginator } from "react-activity-feed";
import styled from "styled-components";

import { LoadMoreButton } from "../components/profile/ProfileSparkles";
import { ProfileSparklesPlaceholder } from "../components/placeholders";
import LoadingIndicator from "../components/LoadingIndicator";
import SparkleBlock from "../components/sparkle/SparkleBlock";
import SearchInput from "../components/trends/SearchInput";

const HashtagPage = () => {
  const { hashtag } = useParams();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (hashtag) setQuery(hashtag);
  }, [hashtag]);

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

      <FlatFeed
        Activity={SparkleBlock}
        feedGroup="hashtags"
        userId={hashtag}
        notify
        LoadingIndicator={LoadingIndicator}
        Placeholder={<ProfileSparklesPlaceholder />}
        Paginator={(props) => (
          <LoadMorePaginator
            {...props}
            LoadMoreButton={(props) => <LoadMoreButton {...props} />}
          />
        )}
        options={{
          ranking: `if(actor.data.verified, 100, 0) + decay_gauss(time) * log(likes + 0.5 * comments + 1)`,
        }}
      />
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
