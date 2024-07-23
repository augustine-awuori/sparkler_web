import { Avatar as AppAvatar, AvatarProps } from "@chakra-ui/react";

const Avatar = ({ size = "sm", ...rest }: AvatarProps) => (
  <AppAvatar
    cursor="pointer"
    size={size}
    bg="var(--theme-color)"
    color="#fff"
    {...rest}
  />
);

export default Avatar;
