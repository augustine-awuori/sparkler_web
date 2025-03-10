import { createContext } from "react";

export type Community = {
  _id: string;
  bio?: string;
  coverImage?: string;
  isVerified: boolean;
  name: string;
  members: string[];
  profileImage?: string;
};

export interface ContextValue {
  communities: Community[];
  setCommunities: (communities: Community[]) => void;
  loading: boolean;
  onLoad: (loading: boolean) => void;
}

export const CommunityContext = createContext<ContextValue>({
  communities: [],
  setCommunities: () => {},
  loading: false,
  onLoad: () => {},
});

export default CommunityContext;
