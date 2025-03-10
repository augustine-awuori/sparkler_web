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
  collapsedOnMount = true, // Default to collapsed for compactness
  minHeight = 100, // Reduced default height to match X.com
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
    if (filesCount > IMAGES_LIMIT) removeAllFiles();
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
          <Avatar image={user?.profileImage || ""} size={40} circle={true} />
        </UserAvatar>
        <InputSection>
          <TextArea
            ref={inputRef}
            onChange={handleInputChange}
            placeholder={placeholder}
            value={text}
            onClick={() => setExpanded(true)}
            maxHeight="100px"
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
                  key={action.id}
                  onClick={action.onclick}
                  aria-label={action.alt}
                >
                  <action.Icon
                    size={16} // Reduced icon size
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
                <TextProgressRing textLength={text.length} />{" "}
                {/* Smaller ring */}
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

const theme = {
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

const Container = styled.div`
  width: 100%;
`;

const ReplyTo = styled.span`
  font-size: 0.8rem; // Slightly smaller
  color: ${theme.grayColor};
  margin-left: 50px; // Adjusted for smaller avatar
  margin-bottom: 6px;
  display: block;
`;

const ReplyName = styled.span`
  color: ${theme.primaryColor};
  margin-left: 3px;
`;

const Form = styled.form<FormProps>`
  display: flex;
  align-items: ${({ inline }) => (inline ? "center" : "flex-start")};
  min-height: ${({ minHeight }) => minHeight};
  gap: 8px; // Reduced gap
`;

const UserAvatar = styled.figure`
  width: 36px; // Slightly smaller
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0;

  &:hover {
    opacity: 0.9;
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
  margin-top: 6px; // Reduced margin
  gap: 6px; // Reduced gap between action buttons
`;

const ActionButton = styled.button`
  padding: 4px; // Reduced padding
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
    box-shadow: 0 0 0 2px ${theme.primaryHoverColor};
  }
`;

const RightActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px; // Reduced gap
`;

const Divider = styled.hr`
  height: 16px; // Reduced height
  width: 1px;
  background: ${theme.borderColor};
  border: none;
  margin: 0 8px; // Reduced margin
`;

const SubmitButton = styled.button`
  background: ${theme.primaryColor};
  color: ${theme.textColor};
  padding: 6px 16px; // Reduced padding
  border-radius: 20px;
  font-size: 0.85rem; // Slightly smaller
  font-weight: 700;
  border: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.primaryHoverColor};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.primaryHoverColor};
  }
`;

const MentionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-width: 250px; // Slightly reduced
  background: ${theme.backgroundColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); // Reduced shadow
  max-height: 180px; // Slightly reduced
  overflow-y: auto;
  z-index: 1000;
`;

const MentionItem = styled.div`
  padding: 6px 10px; // Reduced padding
  color: ${theme.textColor};
  cursor: pointer;
  font-size: 0.85rem; // Slightly smaller

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
