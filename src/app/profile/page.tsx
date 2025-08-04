"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PageTransition from "@/components/PageTransition/PageTransition"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { AddressProvider } from "@/context/AddressContext"
import { AddressList } from "@/components/Address"

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile") // "profile" or "addresses"
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone as string || "",
      })
    }
  }, [session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      toast.success(data.message || "Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
      console.error(error)
    }
  }

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

  return (
    <PageTransition>
      <div className="page-with-header-spacing min-h-screen bg-[#E5E4E2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-center border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === "profile"
                      ? "border-[#FF0000] text-[#FF0000]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`px-6 py-4 text-center border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === "addresses"
                      ? "border-[#FF0000] text-[#FF0000]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Addresses
                </button>
              </nav>
            </div>

            <div className="p-6 md:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#FF0000] transition-colors"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF0000] focus:ring-[#FF0000] disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF0000] focus:ring-[#FF0000] disabled:bg-gray-100"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#FF0000] transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                    <p className="text-gray-600 mt-1">
                      Manage your shipping and billing addresses for faster checkout.
                    </p>
                  </div>

                  <AddressProvider>
                    <AddressList />
                  </AddressProvider>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}