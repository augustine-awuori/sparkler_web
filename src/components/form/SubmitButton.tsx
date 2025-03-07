import React from "react";
import { useFormikContext } from "formik";
import styled from "styled-components";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const SubmitButton = ({ title, ...otherProps }: Props) => {
  const { handleSubmit } = useFormikContext();

  return (
    <LoginButton
      onClick={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      type="submit"
      {...otherProps}
    >
      {title}
    </LoginButton>
  );
};

const LoginButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  margin-top: 1rem;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--primary-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: var(--primary-hover-color);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default SubmitButton;
