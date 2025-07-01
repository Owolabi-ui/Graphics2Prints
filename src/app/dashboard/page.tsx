"use client"

import AuthGuard from "@/components/auth/AuthGuard"
import { useRouter } from "next/navigation"
import PageTransition from "@/components/PageTransition/PageTransition"
import { motion } from "framer-motion"


 export default function Page() {
    const router = useRouter()  

  return (
    <AuthGuard>
      {(session) => (
    <PageTransition>
      <div className="min-h-screen bg-[#E5E4E2] py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl p-6 md:p-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome, {session?.user?.name}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                {/* Add your orders content here */}
                <p className="text-gray-600">No recent orders</p>
              </motion.div>

              {/* Account Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                  {/* Add more account details here */}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/orders')}
                    className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#73483D] transition-colors"
                  >
                    View Orders
                  </button>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#73483D] transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
      )}
     </AuthGuard>
      )
  
  
}




