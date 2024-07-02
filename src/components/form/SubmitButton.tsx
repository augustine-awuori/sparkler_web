import { Box, Button } from "@chakra-ui/react";

interface Props {
  isLoading: boolean;
  label: string;
}

const SubmitButton = ({ isLoading, label }: Props) => (
  <Box marginTop={5}>
    <Button
      width="full"
      type="submit"
      isLoading={isLoading}
      colorScheme="twitter"
      bgColor="twitter.500"
      _hover={{ bgColor: "twitter.600" }}
      _active={{ bgColor: "twitter.700" }}
      color="white"
      fontWeight="bold"
    >
      {label}
    </Button>
  </Box>
);

export default SubmitButton;
