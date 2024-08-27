import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ArrowLeft from "./icons/ArrowLeft";

interface Props {
  title?: string;
}

export default function Header({ title = "Sparkle" }: Props) {
  const navigate = useNavigate();

  const navigateBack = () => navigate(-1);

  return (
    <AppHeader>
      <button className="back-button" onClick={navigateBack}>
        <ArrowLeft size={20} color="white" />
      </button>
      <span className="title">{title}</span>
    </AppHeader>
  );
}

const AppHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 15px;

  .back-button {
    position: absolute;
    left: 15px; /* Adjust this value as needed */
    width: 25px;
    height: 20px;
  }

  .title {
    font-size: 20px;
    color: white;
    font-weight: bold;
  }
`;
