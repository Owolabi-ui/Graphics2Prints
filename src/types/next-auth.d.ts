// next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id?: number;
      /** The user's role. */
      role?: string;
      /** The user's phone number. */
      phone?: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the JWT
   */
  interface User {
    id?: number;
    role?: string;
    phone?: string;
  }
}
