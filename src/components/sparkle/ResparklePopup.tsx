import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FaPencilAlt, FaRetweet } from "react-icons/fa";
import styled from "styled-components";

interface RetweetPopupProps {
  onClose: () => void;
  onResparkle: () => void;
  onQuote: () => void;
  position: { top: number; left: number };
}

interface OptionProps extends FlexProps {
  Icon: IconType;
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
    <Icon />
    <Text ml={2}>{label}</Text>
  </Flex>
);

const ResparklePopup: React.FC<RetweetPopupProps> = ({
  onClose,
  onResparkle,
  onQuote,
  position,
}) => {
  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer
        style={{ top: position.top + "px", left: position.left + "px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Option Icon={FaRetweet} label="Resparkle" onClick={onResparkle} />
        <Option Icon={FaPencilAlt} label="Quote" onClick={onQuote} />
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
