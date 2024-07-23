import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function EditProfileButton() {
  const navigate = useNavigate();

  return (
    <Container>
      <button className={"following"} onClick={() => navigate("edit")}>
        <span className="follow-text__following">Edit Profile</span>
      </button>
    </Container>
  );
}

const Container = styled.div`
  button {
    background-color: #1da1f2;
    color: white;
    border: none;
    border-radius: 18px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease,
      color 0.3s ease;

    &.following {
      background-color: white;
      color: var(--theme-color);
      border: 1px solid var(--theme-color);
    }

    &:hover {
      background-color: var(--theme-color);
      color: #fff;
    }

    &.following .follow-text:hover .follow-text__following {
      display: none;
    }

    &.following .follow-text:hover {
      display: inline-block;
    }
  }
`;
