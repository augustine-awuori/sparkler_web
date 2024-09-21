import React, { useEffect, useRef, useState } from "react";
import { Avatar, EmojiPicker, useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useFiles, useUser } from "../../hooks";
import filesStorage from "../../storage/files";
import Image from "../icons/Image";
import TextProgressRing from "../TextProgressRing";
import TextArea from "../TextArea";
import ImageInputList from "../common/ImageInputList";

interface FormProps {
  inline?: boolean;
  minheight?: string;
}

interface SparkleFormProps {
  submitText?: string;
  onSubmit: (text: string, images: string[]) => Promise<void>;
  className?: string;
  placeholder?: string;
  collapsedOnMount?: boolean;
  minHeight?: number;
  shouldFocus?: boolean;
  replyingTo?: string | null;
}

export const MAX_CHARS = 280;
export const IMAGES_LIMIT = 3;

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
  const [isSelectingImages, setIsSelectingImages] = useState(false);
  const { files, removeAllFiles, filesCount } = useFiles(IMAGES_LIMIT);

  useEffect(() => {
    if (filesCount) removeAllFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldFocus && inputRef.current) inputRef.current.focus();
  }, [shouldFocus, client?.currentUser, user?._id]);

  const actions = [
    {
      id: "image",
      Icon: Image,
      alt: "Image",
      onclick: () => setIsSelectingImages((value) => !value),
    },
    {
      id: "emoji-picker",
      Icon: EmojiPicker,
      alt: "Emoji",
    },
  ];

  const handleEmojiSelect = (emojiData: any) => {
    const emoji = emojiData.native;
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newText =
        text.substring(0, start) + emoji + text.substring(end, text.length);
      setText(newText);

      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        start + emoji.length;
    } else {
      setText(text + emoji);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    let imagesUrl: string[] = [];

    try {
      e.preventDefault();

      if (exceededMax)
        return alert("Sparkle cannot exceed " + MAX_CHARS + " characters");

      if (filesCount) imagesUrl = await filesStorage.saveFiles(files);
      await onSubmit(text, imagesUrl);

      removeAllFiles();
      setText("");
      setIsSelectingImages(false);
      toast.success("Sparkle was a success");
    } catch (error) {
      toast.error("Sparkle couldn't be posted");
      if (filesCount) await filesStorage.deleteFiles(imagesUrl);
    }
  };

  const onClick = () => setExpanded(true);

  const isInputEmpty = !Boolean(text);
  const charsLeft = MAX_CHARS - text.length;
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
          <Avatar image={user?.profileImage} />
        </figure>
        <div className="input-section">
          <TextArea
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
                    key={action.id}
                    style={{ margin: "0 8px" }}
                    onClick={action?.onclick}
                  >
                    <action.Icon
                      size={19}
                      color="var(--theme-color)"
                      onSelect={handleEmojiSelect}
                    />
                  </button>
                );
              })}
            <div className="right">
              <TextProgressRing textLength={text.length} />
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
      {isSelectingImages && <ImageInputList imagesLimit={IMAGES_LIMIT} />}
    </Container>
  );
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
    min-width: 40px;
    min-height: 40px;
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

      .divider {
        height: 30px;
        width: 2px;
        border: none;
        background-color: #444;
        border-radius: 5px;
        margin: 0 18px;
      }

      .submit-btn {
        background-color: var(--theme-color);
        padding: 8px 18px;
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
