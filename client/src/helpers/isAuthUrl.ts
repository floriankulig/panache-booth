export const isAuthUrl = (route: string) =>
  ["/login", "/register", "/update-profile"].some((url) =>
    route.startsWith(url),
  );
