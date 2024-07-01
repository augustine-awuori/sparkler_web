import { useState } from "react";
import classNames from "classnames";
import styled from "styled-components";

const Container = styled.div``;

export default function FollowBtn({ userId }: { userId: string }) {
  const [following, setFollowing] = useState(false);

  return (
    <Container>
      <button
        className={classNames(following ? "following" : "not-following")}
        onClick={() => setFollowing(!following)}
      >
        {following ? (
          <div className="follow-text">
            <span className="follow-text__following">Following</span>
            <span className="follow-text__unfollow">Unfollow</span>
          </div>
        ) : (
          "Follow"
        )}
      </button>
    </Container>
  );
}
