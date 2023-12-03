export const isAuthUrl = (route: string) =>
  ["/login", "/register", "registerVendor"].some((url) =>
    route.startsWith(url),
  );
