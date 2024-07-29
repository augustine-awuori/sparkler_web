import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  ref?: React.RefObject<HTMLTextAreaElement>;
  onClick?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  ref,
  onClick,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null) || ref;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textareaRef, value]);

  return (
    <StyledTextarea
      ref={textareaRef}
      onClick={onClick}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default TextArea;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 4px 12px;
  font-size: 15px;
  line-height: 20px;
  resize: none;
  outline: none;
  box-shadow: none;
  color: #fff;
  background-color: inherit;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: var(--theme-color);
  }

  &::placeholder {
    color: #657786;
  }
`;
