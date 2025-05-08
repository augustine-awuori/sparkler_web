import styled from "styled-components";

const theme = {
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

export default styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  background: ${({ $isActive }) =>
    $isActive ? theme.primaryColor : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${theme.borderColor};
  border-radius: 20px;
  color: ${({ $isActive }) => ($isActive ? "#fff" : theme.textColor)};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive ? theme.primaryHoverColor : "rgba(255, 255, 255, 0.2)"};
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    border-color: ${theme.primaryColor};
    font-weight: bold;
  `}
`;
