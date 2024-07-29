import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ArrowLeft from "./icons/ArrowLeft";

interface Props {
  title?: string;
}

export default function ThreadHeader({ title = "Sparkle" }: Props) {
  const navigate = useNavigate();

  const navigateBack = () => navigate(-1);

  return (
    <Header>
      <button className="back-button" onClick={navigateBack}>
        <ArrowLeft size={20} color="white" />
      </button>
      <span className="title">{title}</span>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 15px;

  .back-button {
    width: 25px;
    height: 20px;
    margin-right: 40px;
  }

  .title {
    font-size: 20px;
    color: white;
    font-weight: bold;
  }
`;
