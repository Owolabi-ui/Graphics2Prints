// This file contains utility functions to check the authentication status and roles of a user session.

import { Session } from "next-auth"

export const isAuthenticated = (session: Session | null): session is Session => {
  return session !== null && typeof session === 'object' && 'user' in session
}

export const hasRequiredRole = (session: Session | null, requiredRole: string): boolean => {
  if (!isAuthenticated(session)) return false
  return session.user?.role === requiredRole
}

export const hasValidToken = (session: Session | null): boolean => {
  if (!isAuthenticated(session)) return false
  return typeof session.expires === 'string' && new Date(session.expires) > new Date()
}

