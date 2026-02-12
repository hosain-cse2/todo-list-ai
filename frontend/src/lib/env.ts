const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const env = {
  API_URL: apiUrl ?? "http://localhost:4000",
};
