import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import styled from "styled-components";
import Retweet from "../icons/Retweet";

interface OptionProps extends FlexProps {
  Icon: JSX.Element;
  label: string;
}

const Option = ({ Icon, label, ...rest }: OptionProps) => (
  <Flex
    align="center"
    color="#fff"
    letterSpacing={0.2}
    cursor="pointer"
    _hover={{ bg: "#2e2d2d" }}
    px={3}
    py={2}
    {...rest}
  >
    {Icon}
    <Text ml={2}>{label}</Text>
  </Flex>
);

interface PopupProps {
  hasBeenResparkled: boolean;
  onClose: () => void;
  onQuote: () => void;
  onResparkle: () => void;
  position: { top: number; left: number };
}

const ResparklePopup: React.FC<PopupProps> = ({
  onClose,
  onResparkle,
  onQuote,
  position,
  hasBeenResparkled,
}) => {
  const handleResparkle = () => {
    onClose();
    onResparkle();
  };

  const handleQuote = () => {
    onClose();
    onQuote();
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer
        style={{ top: position.top + "px", left: position.left + "px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Option
          Icon={<Retweet color="#fff" />}
          label={hasBeenResparkled ? "Undo Resparkle" : "Resparkle"}
          onClick={handleResparkle}
        />
        <Option Icon={<FaPencilAlt />} label="Quote" onClick={handleQuote} />
      </PopupContainer>
    </PopupOverlay>
  );
};

export default ResparklePopup;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  position: absolute;
  background: black;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 0px 0px 7px #fff;

  button {
    padding: 10px;
    background: var(--theme-color);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }
`;
