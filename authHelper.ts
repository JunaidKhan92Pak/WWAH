import { parse as cookieParse } from "cookie";

export const getAuthToken = () => {
  if (typeof document !== "undefined") {
    const cookies = cookieParse(document.cookie);
    return cookies.authToken || null;
  }
  return null;
};
