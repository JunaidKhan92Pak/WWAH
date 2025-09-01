import { parse as cookieParse } from "cookie";

export const getAuthToken = () => {
  if (typeof document !== "undefined") {
    const cookies = cookieParse(document.cookie);
    // console.log(cookies, "parsed cookies");
    return cookies.authToken || null;
  }
  return null;
};
export const deleteAuthToken = () => {
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};