import React from "react";
import styled from "styled-components";

const colors = {
  primary: "#1DA1F2", // X's blue accent
  background: "#15202B", // Dark background
  text: "#FFFFFF", // White text
  textLight: "#8899A6",
  border: "#38444D", // Subtle border
  inputBg: "#1E2A38", // Slightly lighter input background
  focusBorder: "#1DA1F2", // Focus state
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText: (text: string) => void;
}

const FormInput = ({ onChangeText, ...inputProps }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChangeText(e.target.value);
  };

  return <StyledInput type="text" onChange={handleChange} {...inputProps} />;
};

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${colors.inputBg};
  color: var(--text-color);
  font-size: 1.125rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${colors.textLight};
    font-weight: 400;
  }

  &:hover {
    border-color: ${colors.textLight};
  }

  &:focus {
    border-color: ${colors.focusBorder};
    box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.3); // Subtle focus glow
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default FormInput;
