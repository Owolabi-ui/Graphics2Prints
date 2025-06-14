import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { Pool } from 'pg'

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
      })
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
            id: token.sub
          }
        }
      },
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token
        }
        return token
      }
    }
  }
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };