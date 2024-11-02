import { toast } from "react-toastify";

import { FeedUser } from "../contexts/ProfileContext";
import { User } from "../users";

export function getEATZone() {
  const time = new Date();

  return new Date(time.getTime() + 3 * 60 * 60 * 1000).toISOString();
}

export function getProfileUserDataFromUserInfo(user: User): FeedUser {
  return {
    created_at: "",
    id: user._id,
    updated_at: "",
    duration: "",
    data: { ...user },
  };
}

export function copyToClipBorad(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Link copied to clip board"))
    .catch(() => toast.error("Link not copied! Something failed"));
}
