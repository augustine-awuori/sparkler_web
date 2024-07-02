import { Text, TextProps } from "@chakra-ui/react";

const AppText = ({ children, ...otherProps }: TextProps) => (
  <Text {...otherProps} letterSpacing=".5px">
    {children}
  </Text>
);

export default AppText;
