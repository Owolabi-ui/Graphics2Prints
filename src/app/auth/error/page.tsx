"use client"
import { useSearchParams } from "next/navigation"
import PageTransition from "@/components/PageTransition/PageTransition"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-[#E5E4E2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-center text-sm text-red-600">
              {error || "An error occurred during authentication"}
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-[#73483D]"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}