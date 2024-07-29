import React from "react";
import classNames from "classnames";
import styled from "styled-components";

import { MAX_CHARS } from "./sparkle/SparkleForm";
import ProgressRing from "./icons/ProgressRing";

interface ProgressRingProps {
  textLength: number;
}

const TextProgressRing: React.FC<ProgressRingProps> = ({ textLength }) => {
  const charsLeft = MAX_CHARS - textLength;
  const exceededMax = charsLeft < 0;
  const maxAlmostReached = charsLeft <= 20;
  const percentage =
    textLength >= MAX_CHARS ? 100 : (textLength / MAX_CHARS) * 100;

  if (!textLength) return null;

  return (
    <Container>
      <div className="tweet-length">
        <ProgressRing
          stroke={2.2}
          color={
            exceededMax
              ? "red"
              : maxAlmostReached
              ? "#ffd400"
              : "var(--theme-color)"
          }
          radius={maxAlmostReached ? 19 : 14}
          progress={percentage}
        />
        {maxAlmostReached && (
          <span
            className={classNames("tweet-length__text", exceededMax && "red")}
          >
            {charsLeft}
          </span>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .tweet-length {
    position: relative;

    svg {
      position: relative;
      top: 2px;
    }

    &__text {
      position: absolute;
      color: #888;
      font-size: 10px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      height: max-content;
      width: max-content;

      &.red {
        color: red;
      }
    }
  }
`;

export default TextProgressRing;
