"use client"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import PageTransition from "@/components/PageTransition/PageTransition"
import { motion } from "framer-motion"

interface AuthGuardProps {
  children: (session: Session | null) => React.ReactNode
  }

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    }
  });

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-[#E5E4E2]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
          />
        </div>
      </PageTransition>
    )
  }

 
  return <>{children(session)}</>
}

export default AuthGuard;