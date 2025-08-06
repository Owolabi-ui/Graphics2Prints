"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  CogIcon,
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function AdminSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<any>({})
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Redirect non-admins
  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.role || session.user.role !== "admin") {
      router.replace("/login")
      return
    }
    loadSettings()
  }, [session, status, router])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast.error('Failed to load settings')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: string, key: string, currentValue: any) => {
    const editKey = `${category}.${key}`
    setEditingItem(editKey)
    setEditValue(String(currentValue))
  }

  const handleSave = async (category: string, key: string, dataType: string) => {
    try {
      setIsSaving(true)
      
      let processedValue = editValue
      
      // Process value based on type
      if (dataType === 'boolean') {
        processedValue = editValue.toLowerCase() === 'true' ? 'true' : 'false'
      } else if (dataType === 'number') {
        processedValue = String(parseFloat(editValue) || 0)
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          setting_key: key,
          setting_value: processedValue,
          data_type: dataType
        })
      })

      if (response.ok) {
        toast.success('Setting updated successfully!')
        setEditingItem(null)
        loadSettings() // Refresh settings
      } else {
        toast.error('Failed to update setting')
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Failed to update setting')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setEditValue('')
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const settingsCategories = [
    {
      title: "General Settings",
      description: "Basic site configuration",
      icon: CogIcon,
      color: "bg-blue-500",
      category: "general",
      settings: [
        { key: "site_name", name: "Site Name", type: "text" },
        { key: "site_description", name: "Site Description", type: "text" },
        { key: "contact_email", name: "Contact Email", type: "email" },
        { key: "phone_number", name: "Phone Number", type: "tel" },
        { key: "business_address", name: "Business Address", type: "text" }
      ]
    },
    {
      title: "Payment Settings", 
      description: "Payment gateway configuration",
      icon: KeyIcon,
      color: "bg-green-500",
      category: "payment",
      settings: [
        { key: "paystack_mode", name: "Paystack Mode", type: "select", options: ["live", "test"] },
        { key: "currency", name: "Currency", type: "select", options: ["NGN", "USD", "GBP"] },
        { key: "tax_rate", name: "Tax Rate (%)", type: "number" },
        { key: "minimum_order", name: "Minimum Order (₦)", type: "number" }
      ]
    },
    {
      title: "Security Settings",
      description: "Admin and security configuration", 
      icon: ShieldCheckIcon,
      color: "bg-red-500",
      category: "security",
      settings: [
        { key: "two_factor_auth", name: "Two-Factor Authentication", type: "boolean" },
        { key: "session_timeout", name: "Session Timeout (minutes)", type: "number" },
        { key: "admin_email_notifications", name: "Admin Email Notifications", type: "boolean" },
        { key: "failed_login_attempts", name: "Max Failed Login Attempts", type: "number" }
      ]
    },
    {
      title: "Notification Settings",
      description: "Email and alert preferences",
      icon: BellIcon,
      color: "bg-purple-500", 
      category: "notifications",
      settings: [
        { key: "new_order_notifications", name: "New Order Notifications", type: "boolean" },
        { key: "low_stock_alerts", name: "Low Stock Alerts", type: "boolean" },
        { key: "customer_registration_alerts", name: "Customer Registration Alerts", type: "boolean" },
        { key: "payment_notifications", name: "Payment Notifications", type: "boolean" }
      ]
    },
    {
      title: "Website Settings",
      description: "Public website configuration",
      icon: GlobeAltIcon,
      color: "bg-orange-500",
      category: "website", 
      settings: [
        { key: "maintenance_mode", name: "Maintenance Mode", type: "boolean" },
        { key: "customer_registration", name: "Customer Registration", type: "boolean" },
        { key: "guest_checkout", name: "Guest Checkout", type: "boolean" },
        { key: "order_approval_required", name: "Order Approval Required", type: "boolean" }
      ]
    }
  ]

  const renderSettingValue = (category: string, setting: any) => {
    const value = settings[category]?.[setting.key]
    const editKey = `${category}.${setting.key}`
    const isEditing = editingItem === editKey

    if (isEditing) {
      if (setting.type === 'select') {
        return (
          <div className="flex items-center space-x-2">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {setting.options?.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              onClick={() => handleSave(category, setting.key, setting.type)}
              disabled={isSaving}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )
      } else if (setting.type === 'boolean') {
        return (
          <div className="flex items-center space-x-2">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            <button
              onClick={() => handleSave(category, setting.key, setting.type)}
              disabled={isSaving}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )
      } else {
        return (
          <div className="flex items-center space-x-2">
            <input
              type={setting.type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSave(category, setting.key, setting.type)}
              disabled={isSaving}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )
      }
    }

    // Display mode
    let displayValue = value
    if (setting.type === 'boolean') {
      displayValue = value ? 'Enabled' : 'Disabled'
    }

    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">
          {displayValue || 'Not set'}
        </span>
        <button
          onClick={() => handleEdit(category, setting.key, value)}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

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
            Admin Settings
          </h1>
          <p className="text-gray-600">
            Configure your Graphics2Prints platform settings and preferences.
          </p>
        </motion.div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {category.title}
                      </h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Settings List */}
                <div className="p-6">
                  <div className="space-y-4">
                    {category.settings.map((setting, settingIndex) => (
                      <div 
                        key={settingIndex}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {setting.name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-3">
                          {renderSettingValue(category.category, setting)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-sm text-green-800">
            <strong>Settings System Active:</strong> All settings are now fully functional and will be saved to the database. 
            Changes take effect immediately and persist across sessions.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
