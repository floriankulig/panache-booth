export const isAuthUrl = (route: string) =>
  ["/login", "/register"].some((url) => route.startsWith(url));
