import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export type Option = {
  Icon: JSX.Element;
  label: string;
  onClick: () => void;
};

interface Props {
  position: { top: number; right: number };
  options: Option[];
  onClose: () => void;
}

const MoreOptionsPopup: React.FC<Props> = ({ onClose, options, position }) => {
  const handleClick = (onClick: () => void) => {
    onClose();
    onClick();
  };

  return (
    <Box
      position="absolute"
      top={position.top}
      right={position.right}
      bg="#1a1a1a"
      p={2}
      borderRadius="md"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.4)"
      zIndex={10}
      width="220px"
      border="1px solid #333"
    >
      {options.map(({ Icon, label, onClick }, index) => (
        <Flex
          key={index}
          align="center"
          cursor="pointer"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#333" }}
          onClick={() => handleClick(onClick)}
        >
          <Box mr={3} fontSize="20px" color="var(--theme-color)">
            {Icon}
          </Box>
          <Text color="white" fontSize="16px" fontWeight="medium">
            {label}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default MoreOptionsPopup;
