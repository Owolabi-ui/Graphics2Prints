import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export default withAuth(
  async function middleware(request: NextRequest) {
    // Existing JWT token verification
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      // If JWT verification passes, continue with NextAuth check
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  },
  {
    callbacks: {
      // NextAuth authorization check
      authorized: ({ token }) => {
        // Return true if user has a valid session token
        return !!token
      }
    },
    pages: {
      signIn: '/login',
      error: '/auth/error'
    }
  }
)

// Protected route patterns
export const config = {
  matcher: [
    /*
     * Match all protected routes:
     * - dashboard and its subroutes
     * - profile and its subroutes
     * - orders and its subroutes
     * - cart and its subroutes
     */
    '/dashboard/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/cart/:path*'
  ]
}