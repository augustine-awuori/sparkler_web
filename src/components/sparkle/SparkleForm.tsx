import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useStreamContext } from "react-activity-feed";
import styled from "styled-components";

import { randomImageUrl } from "../../utils/types";
import { User } from "../../users";
import { useUser } from "../../hooks";
import Calendar from "../icons/Calendar";
import Emoji from "../icons/Emoji";
import Gif from "../icons/Gif";
import Image from "../icons/Image";
import Location from "../icons/Location";
import Poll from "../icons/Poll";
import ProgressRing from "../icons/ProgressRing";

interface FormProps {
  inline?: boolean;
  minheight?: string;
}

const Container = styled.div`
  width: 100%;

  .reply-to {
    font-size: 14px;
    color: #888;
    display: flex;
    margin-left: 55px;
    margin-bottom: 10px;

    &--name {
      margin-left: 4px;
      color: var(--theme-color);
    }
  }
`;

const Form = styled.form<FormProps>`
  width: 100%;
  display: flex;
  align-items: ${({ inline }) => (inline ? "center" : "initial")};

  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .input-section {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: ${({ inline }) => (inline ? "row" : "column")};
    align-items: ${({ inline }) => (inline ? "center" : "initial")};
    height: ${({ inline, minheight: minHeight }) =>
      inline ? "40px" : minHeight};

    textarea {
      padding-top: 10px;
      background: none;
      border: none;
      padding-bottom: 0;
      font-size: 18px;
      width: 100%;
      flex: 1;
      resize: none;
      outline: none;
      color: white;
    }

    .actions {
      margin-top: ${({ inline }) => (inline ? "0" : "auto")};
      display: flex;
      height: 50px;
      align-items: center;

      button {
        margin: 0 8px;
        &:disabled {
          opacity: 0.5;
        }
      }

      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
      }

      .tweet-length {
        position: relative;

        svg {
          position: relative;
          top: 2px;
        }

        &__text {
          position: absolute;
          color: #888;
          font-size: 14px;
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

      .divider {
        height: 30px;
        width: 2px;
        border: none;
        background-color: #444;
        margin: 0 18px;
      }

      .submit-btn {
        background-color: var(--theme-color);
        padding: 10px 20px;
        color: white;
        border-radius: 30px;
        margin-left: auto;
        font-weight: bold;
        font-size: 16px;

        &:disabled {
          opacity: 0.6;
        }
      }
    }
  }
`;

const actions = [
  {
    id: "image",
    Icon: Image,
    alt: "Image",
  },
  {
    id: "gif",
    Icon: Gif,
    alt: "GIF",
  },
  {
    id: "poll",
    Icon: Poll,
    alt: "Poll",
  },
  {
    id: "emoji",
    Icon: Emoji,
    alt: "Emoji",
  },
  {
    id: "schedule",
    Icon: Calendar,
    alt: "Schedule",
  },
  {
    id: "location",
    Icon: Location,
    alt: "Location",
  },
];

interface SparkleFormProps {
  submitText?: string;
  onSubmit: (text: string) => Promise<void>;
  className?: string;
  placeholder?: string;
  collapsedOnMount?: boolean;
  minHeight?: number;
  shouldFocus?: boolean;
  replyingTo?: string | null;
}

export default function SparkleForm({
  submitText = "Sparkle",
  onSubmit,
  className,
  placeholder,
  collapsedOnMount = false,
  minHeight = 120,
  shouldFocus = false,
  replyingTo = null,
}: SparkleFormProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { client } = useStreamContext();
  const [expanded, setExpanded] = useState(!collapsedOnMount);
  const [text, setText] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (shouldFocus && inputRef.current) inputRef.current.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFocus, client?.currentUser, user?._id]);

  const MAX_CHARS = 280;

  const percentage =
    text.length >= MAX_CHARS ? 100 : (text.length / MAX_CHARS) * 100;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (exceededMax)
      return alert("Tweet cannot exceed " + MAX_CHARS + " characters");

    await onSubmit(text);

    setText("");
  };

  const onClick = () => {
    setExpanded(true);
  };

  const isInputEmpty = !Boolean(text);

  const charsLeft = MAX_CHARS - text.length;
  const maxAlmostReached = charsLeft <= 20;
  const exceededMax = charsLeft < 0;

  const isReplying = Boolean(replyingTo);

  return (
    <Container>
      {isReplying && expanded && (
        <span className="reply-to">
          Replying to <span className="reply-to--name">@{replyingTo}</span>
        </span>
      )}
      <Form
        minheight={minHeight + "px"}
        inline={!expanded}
        className={className}
        onSubmit={submit}
      >
        <figure className="user">
          <img
            src={(user as User | undefined)?.avatar || randomImageUrl}
            alt="profile"
          />
        </figure>
        <div className="input-section">
          <textarea
            ref={inputRef}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            value={text}
            onClick={onClick}
          />
          <div className="actions">
            {expanded &&
              actions.map((action) => {
                return (
                  <button
                    type="button"
                    disabled={action.id === "location"}
                    key={action.id}
                    style={{ margin: "0 8px" }}
                  >
                    <action.Icon size={19} color="var(--theme-color)" />
                  </button>
                );
              })}
            <div className="right">
              {!isInputEmpty && (
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
                      className={classNames(
                        "tweet-length__text",
                        exceededMax && "red"
                      )}
                    >
                      {charsLeft}
                    </span>
                  )}
                </div>
              )}
              {!isInputEmpty && <hr className="divider" />}
              <button
                type="submit"
                className="submit-btn"
                disabled={isInputEmpty}
              >
                {submitText}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
}
