"use client"

import { useState, useEffect } from "react"
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getDashboardStats, getRecentActivity } from "../../Api/Service/apiService"
import ManageEmployees from "./dashboard/ManageEmployees"
import ManageCompanies from "./dashboard/ManageCompanies"
import HireRequests from "./dashboard/HireRequests"
import SettingsPanel from "./dashboard/SettingsPanel"

export default function AdminPanel() {
  const navigate = useNavigate()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [toasts, setToasts] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    total_employees: 0,
    active_companies: 0,
    pending_requests: 0,
    cvs_processed: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)

  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }

  // Fetch dashboard data on mount and when switching to dashboard
  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchDashboardData()
    }
  }, [activeSection])

  const fetchDashboardData = async () => {
    // Fetch stats
    setLoadingStats(true)
    try {
      const statsResponse = await getDashboardStats()
      console.log("Dashboard Stats Response:", statsResponse)
      if (statsResponse && statsResponse.ok) {
        setDashboardStats(statsResponse.stats)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      showToast("error", "Failed to load dashboard statistics")
    } finally {
      setLoadingStats(false)
    }

    // Fetch recent activity
    setLoadingActivities(true)
    try {
      const activityResponse = await getRecentActivity()
      console.log("Recent Activity Response:", activityResponse)
      console.log("Activities array:", activityResponse?.activities)
      console.log("Activities length:", activityResponse?.activities?.length)
      if (activityResponse && activityResponse.ok) {
        console.log("Setting recent activities:", activityResponse.activities)
        setRecentActivities(activityResponse.activities || [])
      } else {
        console.log("Activity response not ok or missing")
        setRecentActivities([])
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      showToast("error", "Failed to load recent activity")
      setRecentActivities([])
    } finally {
      setLoadingActivities(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "employee":
        return { icon: Users, bgColor: "bg-blue-100", iconColor: "text-blue-600" }
      case "company":
        return { icon: Building2, bgColor: "bg-green-100", iconColor: "text-green-600" }
      case "hire_request":
        return { icon: FileText, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" }
      default:
        return { icon: FileText, bgColor: "bg-gray-100", iconColor: "text-gray-600" }
    }
  }

  const getActivityTitle = (type) => {
    switch (type) {
      case "employee":
        return "New employee added"
      case "company":
        return "Company registered"
      case "hire_request":
        return "Hire request received"
      default:
        return "Activity"
    }
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently"

    // Parse the timestamp - if it doesn't have timezone info, treat it as UTC
    let date = new Date(timestamp)

    // If the timestamp doesn't include 'Z' or timezone offset, it's likely UTC from database
    // MySQL/TiDB returns timestamps without timezone indicator, so we need to parse as UTC
    if (!timestamp.includes("Z") && !timestamp.includes("+") && !timestamp.includes("-", 10)) {
      // Manually parse as UTC by adding 'Z'
      date = new Date(timestamp + "Z")
    }

    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleLogout = () => {
    localStorage.removeItem("agn_admin_user")
    localStorage.removeItem("agn_admin_authenticated")
    showToast("success", "Logged out successfully")
    setTimeout(() => navigate("/"), 1000)
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Manage Employees", icon: Users },
    { id: "companies", label: "Manage Companies", icon: Building2 },
    { id: "hire-requests", label: "Hire Requests", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-gradient-to-b from-black to-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed h-screen z-50 shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-black text-lg">A</span>
              </div>
              <div>
                <h2 className="font-black text-white text-lg">Admin</h2>
                <p className="text-xs text-gray-400">Control Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
              <span className="text-black font-black text-lg">A</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="absolute -right-3 top-24 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-lg"
        >
          {sidebarExpanded ? (
            <ChevronLeft size={16} className="text-black" />
          ) : (
            <ChevronRight size={16} className="text-black" />
          )}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${
                  activeSection === item.id
                    ? "bg-yellow-400 text-black border-l-4 border-yellow-600"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                } ${!sidebarExpanded && "justify-center px-0"}`}
              >
                <Icon size={22} className={sidebarExpanded ? "" : "mx-auto"} />
                {sidebarExpanded && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition rounded-lg ${
              !sidebarExpanded && "justify-center px-0"
            }`}
          >
            <LogOut size={22} className={sidebarExpanded ? "" : "mx-auto"} />
            {sidebarExpanded && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 ${sidebarExpanded ? "ml-64" : "ml-20"} transition-all duration-300 min-h-screen flex flex-col max-w-full overflow-hidden`}
      >
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-md border-b-2 border-amber-400 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-black">
                {menuItems.find((item) => item.id === activeSection)?.label || "Admin Panel"}
              </h1>
              <p className="text-sm text-gray-500">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-black">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1 overflow-auto max-w-full">
          {activeSection === "dashboard" && (
            <div>
              {/* Dashboard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={32} className="opacity-90" />
                    {loadingStats ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-3xl font-black">{dashboardStats.total_employees}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Total Employees</h3>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 size={32} className="opacity-90" />
                    {loadingStats ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-3xl font-black">{dashboardStats.active_companies}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Active Companies</h3>
                </div>

                <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-6 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <FileText size={32} className="opacity-90" />
                    {loadingStats ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    ) : (
                      <span className="text-3xl font-black">{dashboardStats.pending_requests}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Pending Requests</h3>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <Download size={32} className="opacity-90" />
                    {loadingStats ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-3xl font-black">{dashboardStats.cvs_processed}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium opacity-90">CVs Processed</h3>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
                    Recent Activity
                  </h3>
                  {loadingActivities ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => {
                        const { icon: Icon, bgColor, iconColor } = getActivityIcon(activity.type)
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
                              <Icon size={20} className={iconColor} />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm">{getActivityTitle(activity.type)}</p>
                              <p className="text-xs text-gray-500">
                                {activity.name}
                                {activity.detail ? ` - ${activity.detail}` : ""}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveSection("employees")}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 text-left group hover:shadow-md transform hover:scale-105"
                    >
                      <Users size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-black text-sm text-black">Add Employee</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("companies")}
                      className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 text-left group hover:shadow-md transform hover:scale-105"
                    >
                      <Building2
                        size={24}
                        className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform"
                      />
                      <p className="font-black text-sm text-black">Add Company</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("hire-requests")}
                      className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all duration-300 text-left group hover:shadow-md transform hover:scale-105"
                    >
                      <FileText size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-black text-sm text-black">View Requests</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("settings")}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 text-left group hover:shadow-md transform hover:scale-105"
                    >
                      <Settings size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-black text-sm text-black">Settings</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "employees" && <ManageEmployees />}

          {activeSection === "companies" && <ManageCompanies />}

          {activeSection === "hire-requests" && <HireRequests />}

          {activeSection === "settings" && <SettingsPanel />}
        </main>
      </div>

      {/* Toast container */}
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transform transition-all duration-200 pointer-events-auto ${
              t.type === "success" ? "bg-emerald-600" : t.type === "info" ? "bg-sky-600" : "bg-rose-600"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
