"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    // Redirect non-admins
    if (!session?.user?.role || session.user.role !== "admin") {
      router.replace("/login")
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const adminCards = [
    {
      title: "Products",
      description: "Manage product catalog",
      icon: ShoppingBagIcon,
      href: "/admin/products",
      color: "bg-blue-500",
      stats: "Manage Inventory"
    },
    {
      title: "Orders",
      description: "View and manage orders",
      icon: ClipboardDocumentListIcon,
      href: "/admin/orders",
      color: "bg-green-500",
      stats: "Track Orders"
    },
    {
      title: "Customers",
      description: "Customer management",
      icon: UsersIcon,
      href: "/admin/customers",
      color: "bg-purple-500",
      stats: "Coming Soon"
    },
    {
      title: "Analytics",
      description: "Sales and performance",
      icon: ChartBarIcon,
      href: "/admin/analytics",
      color: "bg-orange-500",
      stats: "Coming Soon"
    },
    {
      title: "Revenue (₦)",
      description: "Financial overview",
      icon: CurrencyDollarIcon,
      href: "/admin/revenue",
      color: "bg-emerald-500",
      stats: "Coming Soon"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: CogIcon,
      href: "/admin/settings",
      color: "bg-gray-500",
      stats: "Configure System"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 page-with-header-spacing">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {session?.user?.name}. Manage your Graphics2Prints platform.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue (₦)</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => {
              const Icon = card.icon
              const isComingSoon = card.stats === "Coming Soon"
              
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  {isComingSoon ? (
                    <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 cursor-not-allowed opacity-60">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${card.color} rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {card.stats}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {card.description}
                      </p>
                    </div>
                  ) : (
                    <Link href={card.href}>
                      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-strong hover:border-red-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 ${card.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            {card.stats}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {card.description}
                        </p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
            <div className="text-center py-12">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-600">
                Recent orders, product updates, and customer activities will appear here.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
