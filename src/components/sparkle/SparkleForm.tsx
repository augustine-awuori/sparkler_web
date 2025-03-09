import React, { useEffect, useRef, useState } from "react";
import { Avatar, EmojiPicker } from "react-activity-feed";
import { toast } from "react-toastify";
import styled from "styled-components";

import { events, logEvent } from "../../storage/analytics";
import { Image } from "../../assets/icons";
import { useFiles, useUser, useUsers } from "../../hooks";
import filesStorage from "../../storage/files";
import ImageInputList from "../common/ImageInputList";
import TextArea from "../TextArea";
import TextProgressRing from "../TextProgressRing";

interface FormProps {
  inline?: boolean;
  minHeight?: string;
}

interface SparkleFormProps {
  submitText?: string;
  onSubmit: (text: string, images: string[]) => Promise<any>;
  className?: string;
  placeholder?: string;
  collapsedOnMount?: boolean;
  minHeight?: number;
  shouldFocus?: boolean;
  replyingTo?: string | null;
  sparkling: boolean;
}

export const MAX_CHARS = 280;
export const IMAGES_LIMIT = 3;

export default function SparkleForm({
  submitText = "Sparkle",
  onSubmit,
  className,
  placeholder = "What’s sparkling?",
  collapsedOnMount = false,
  minHeight = 120,
  shouldFocus = false,
  replyingTo = null,
  sparkling,
}: SparkleFormProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [expanded, setExpanded] = useState(!collapsedOnMount);
  const [text, setText] = useState("");
  const { user } = useUser();
  const { users } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [isSelectingImages, setIsSelectingImages] = useState(false);
  const [mentionVisible, setMentionVisible] = useState(false);
  const { files, removeAllFiles, filesCount } = useFiles(IMAGES_LIMIT);

  useEffect(() => {
    if (filesCount > IMAGES_LIMIT) removeAllFiles(); // Clear if limit exceeded
  }, [filesCount, removeAllFiles]);

  useEffect(() => {
    if (shouldFocus && inputRef.current) inputRef.current.focus();
  }, [shouldFocus]);

  const actions = [
    {
      id: "image",
      Icon: Image,
      alt: "Add Image",
      onclick: () => setIsSelectingImages((value) => !value),
    },
    {
      id: "emoji-picker",
      Icon: EmojiPicker,
      alt: "Add Emoji",
    },
  ];

  const handleInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(value);
    const match = value.match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      setFilteredUsers(
        Object.keys(users).filter((u) => u.toLowerCase().startsWith(query))
      );
      setMentionVisible(true);
    } else setMentionVisible(false);
  };

  const handleEmojiSelect = (emojiData: any) => {
    const emoji = emojiData.native;
    if (!inputRef.current) return setText(text + emoji);

    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setText(newText);
    inputRef.current.selectionStart = inputRef.current.selectionEnd =
      start + emoji.length;
  };

  const handleMentionClick = (username: string) => {
    const updatedText = text.replace(/@(\w*)$/, `@${username} `);
    setText(updatedText);
    setMentionVisible(false);
    inputRef?.current?.focus();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.info("Login to sparkle");
    if (text.length > MAX_CHARS)
      return toast.error(`Sparkle cannot exceed ${MAX_CHARS} characters`);

    let imagesUrl: string[] = [];
    try {
      if (filesCount) imagesUrl = await filesStorage.saveFiles(files);
      await onSubmit(text, imagesUrl);
      removeAllFiles();
      logEvent(events.userInteraction.SPARKLE, { userId: user?._id });
      setText("");
      setIsSelectingImages(false);
      toast.success("Sparkle was a success");
    } catch (error) {
      toast.error("Sparkle couldn't be posted");
      if (filesCount) await filesStorage.deleteFiles(imagesUrl);
    }
  };

  const isInputEmpty = !text.trim();
  const charsLeft = MAX_CHARS - text.length;
  const textLimitExceeded = charsLeft < 0;
  const isReplying = Boolean(replyingTo);

  return (
    <Container className={className}>
      {isReplying && expanded && (
        <ReplyTo>
          Replying to <ReplyName>@{replyingTo}</ReplyName>
        </ReplyTo>
      )}
      <Form minHeight={`${minHeight}px`} inline={!expanded} onSubmit={submit}>
        <UserAvatar>
          <Avatar image={user?.profileImage} size={40} />
        </UserAvatar>
        <InputSection>
          <TextArea
            ref={inputRef}
            onChange={handleInputChange}
            placeholder={placeholder}
            value={text}
            onClick={() => setExpanded(true)}
          />
          {mentionVisible && (
            <MentionsDropdown>
              {filteredUsers.map((username) => (
                <MentionItem
                  key={username}
                  onClick={() => handleMentionClick(username)}
                >
                  @{username}
                </MentionItem>
              ))}
            </MentionsDropdown>
          )}
          {expanded && (
            <Actions>
              {actions.map((action) => (
                <ActionButton
                  type="button"
                  key={action.id}
                  onClick={action.onclick}
                  aria-label={action.alt}
                >
                  <action.Icon
                    size={18}
                    color="var(--primary-color)"
                    onSelect={
                      action.id === "emoji-picker"
                        ? handleEmojiSelect
                        : undefined
                    }
                  />
                </ActionButton>
              ))}
              <RightActions>
                <TextProgressRing textLength={text.length} />
                {!isInputEmpty && <Divider />}
                <SubmitButton
                  type="submit"
                  disabled={isInputEmpty || textLimitExceeded || sparkling}
                >
                  {submitText}
                </SubmitButton>
              </RightActions>
            </Actions>
          )}
        </InputSection>
      </Form>
      {isSelectingImages && <ImageInputList imagesLimit={IMAGES_LIMIT} />}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 15px;
`;

const ReplyTo = styled.span`
  font-size: 0.875rem;
  color: var(--gray-color);
  margin-left: 55px;
  margin-bottom: 8px;
  display: block;
`;

const ReplyName = styled.span`
  color: var(--primary-color);
  margin-left: 4px;
`;

const Form = styled.form<FormProps>`
  display: flex;
  align-items: ${({ inline }) => (inline ? "center" : "flex-start")};
  min-height: ${({ minHeight }) => minHeight};
`;

const UserAvatar = styled.figure`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(29, 161, 242, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-color);
  }
`;

const RightActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const Divider = styled.hr`
  height: 20px;
  width: 1px;
  background: var(--border-color);
  border: none;
  margin: 0 12px;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: var(--text-color);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--primary-hover-color);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-hover-color);
  }
`;

const MentionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-width: 300px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const MentionItem = styled.div`
  padding: 8px 12px;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
