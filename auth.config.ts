import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = ["/home", "/classes", "/profile", "/inbox"];

export default {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized: ({ request, auth }) => {
      const { pathname } = request.nextUrl;
      const needsAuth = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );
      if (!needsAuth) return true;
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
