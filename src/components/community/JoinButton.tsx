import { Spinner } from "@chakra-ui/react";
import styled from "styled-components";

interface Props {
  onClick: VoidFunction;
  joined: boolean;
  joining: boolean;
}

export default function JoinButton({ joined, joining, onClick }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Button joined={joined} onClick={handleClick} disabled={joining}>
      {joining ? (
        <Spinner
          size="sm"
          speed="0.65s"
          color="var(--text-color)"
          thickness="2px"
        />
      ) : joined ? (
        "Joined"
      ) : (
        "Join"
      )}
    </Button>
  );
}

const Button = styled.button<{ joined: boolean }>`
  padding: 8px 16px;
  background: ${(props) =>
    props.joined || props.disabled ? "transparent" : "var(--primary-color)"};
  color: var(--text-color);
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.joined || props.disabled
        ? "rgba(255, 255, 255, 0.1)"
        : "var(--primary-hover-color)"};
  }

  /* Ensure spinner is centered */
  > * {
    margin: 0 auto;
  }
`;
