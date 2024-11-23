import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  ref?: React.RefObject<HTMLTextAreaElement>;
  value: string;
}

const TextArea: React.FC<Props> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(null) || props.ref;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [ref]);

  return <StyledTextarea autoFocus {...props} />;
};

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

export default TextArea;
