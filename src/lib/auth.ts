import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from 'pg'
import bcrypt from "bcryptjs"
import type { UserRole } from "@/types/auth";

// Use environment variable for database connection (works with both local and Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "select_account"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT * FROM customers WHERE email = $1",
            [email]
          );
          const user = result.rows[0];
          if (user && (await bcrypt.compare(password, user.password_hash))) {
            // Return all required fields for your User type
            return {
              id: user.customer_id,
              customer_id: user.customer_id,
              name: user.name,
              email: user.email,
              oauth_provider: user.oauth_provider || null,
              oauth_id: user.oauth_id || null,
              role: user.role || 'customer' as UserRole,
              phone: user.phone || null,
              address: user.address || null,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };
          }
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "google") {
        const client = await pool.connect();
        try {
          // Check if user exists
          const existingUser = await client.query(
            "SELECT * FROM customers WHERE email = $1",
            [user.email]
          );

          if (existingUser.rows.length === 0) {
            // Create new user
            await client.query(
              `INSERT INTO customers (name, email, oauth_provider, oauth_id, role, created_at, updated_at) 
               VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
              [user.name, user.email, "google", account.providerAccountId, "customer"]
            );
          } else {
            // Update existing user's OAuth info if needed
            await client.query(
              `UPDATE customers 
               SET oauth_provider = $1, oauth_id = $2, updated_at = NOW() 
               WHERE email = $3`,
              ["google", account.providerAccountId, user.email]
            );
          }
        } finally {
          client.release();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.customer_id = (user as any).customer_id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        token.address = (user as any).address;
      }
      
      // Always fetch latest role from database for consistent admin access
      if (token.email) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT role, is_admin FROM customers WHERE email = $1",
            [token.email]
          );
          const dbUser = result.rows[0];
          if (dbUser) {
            // Check for admin role - either explicit role or is_admin flag
            if (dbUser.role === 'admin' || dbUser.is_admin === true) {
              token.role = 'admin';
            } else {
              token.role = dbUser.role || 'customer';
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          client.release();
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).customer_id = token.customer_id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
        (session.user as any).address = token.address;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
