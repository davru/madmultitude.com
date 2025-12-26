import { sdk } from "../sdk";

export const getAuthToken = async (): Promise<string> => {
  const token = await sdk.auth.login("customer", "emailpass", {
    email: 'davidsanrubio@gmail.com',
    password: 'fokvaf-soxha2-nembiT'
  });

  if (!token || typeof token !== "string") {
    throw new Error("Failed to fetch auth token");
  }

  return token;
};