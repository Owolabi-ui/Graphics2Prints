import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { Pool } from 'pg'
import bcrypt from "bcryptjs"
import type { UserRole } from "@/types/auth";
import CredentialsProvider from "next-auth/providers/credentials";

const pool = new Pool({
  user: 'postgres',
  password: 'Beyonce123@',
  host: 'localhost',
  port: 5432,
  database: 'herde_ent'
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
          role: user.role || "user", // default to "user" if not set
        };
      }
      return null;
    } finally {
      client.release();
    }
  },
}),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    debug: process.env.NODE_ENV === "development",
    pages: {
      signIn: '/login',
      error: '/auth/error'
    },
    callbacks: {
      async signIn({ user, account }) {
        if (!user?.email) return false
  
        try {
          const client = await pool.connect()
          try {
            await client.query('BEGIN')
            
            const existingUser = await client.query(
              'SELECT * FROM customers WHERE email = $1',
              [user.email]
            )
  
            if (existingUser.rows.length === 0) {
              await client.query(
                `INSERT INTO customers (
                  name,
                  email,
                  oauth_provider,
                  oauth_id,
                  created_at,
                  updated_at
                ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [user.name, user.email, account?.provider, account?.providerAccountId]
              )
            }
  
            await client.query('COMMIT')
            return true
          } catch (error) {
            await client.query('ROLLBACK')
            console.error('Sign in error:', error)
            return false
          } finally {
            client.release()
          }
        } catch (error) {
          console.error('Database connection error:', error)
          return false
        }
      },
      
      async session({ session, token }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            customer_id: token.customer_id ?? token.sub,
            role: token.role,
          }
        }
      },
      async jwt({ token, user, account }) {
        if (user && user.customer_id) {
       token.customer_id = user.customer_id;
        }
       // Fetch role from DB on first login
      if (user && user.email) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT role, is_admin FROM customers WHERE email = $1",
            [user.email]
          );
          const dbUser = result.rows[0];
          // Prefer explicit role, fallback to is_admin boolean
          if (dbUser?.role) {
            token.role = dbUser.role;
          } else if (dbUser?.is_admin) {
            token.role = "admin";
          } else {
            token.role = "user";
          }
        } finally {
          client.release();
        }
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  }
  }
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };