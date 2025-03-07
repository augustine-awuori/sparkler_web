import { useState } from "react";
import { toast } from "react-toastify";

import authApi from "../services/auth";

export default function useAuthCode() {
  const [error, setError] = useState("");
  const [isRequestingAuthCode, setRequestingAuthCode] = useState(false);

  const requestAuthCode = async (isValidEmail: boolean, email: string) => {
    if (error) setError("");

    if (isValidEmail) {
      setRequestingAuthCode(true);
      const { ok } = await authApi.getAuthCode(email);
      setRequestingAuthCode(false);

      ok
        ? toast.success("Check your email for the Auth Code")
        : toast.error("Code couldn't be sent! Are you sure the email exists?");
    } else setError("Enter a valid email address to get the code");
  };

  return { requestAuthCode, isRequestingAuthCode };
}
