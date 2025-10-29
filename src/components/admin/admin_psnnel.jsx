import { useState } from "react"
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Download, 
  Search, 
  Upload, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import ManageEmployees from "../dashboard/ManageEmployees"
import ManageCompanies from "../dashboard/ManageCompanies"
import HireRequests from "../dashboard/HireRequests"
import SettingsPanel from "../dashboard/SettingsPanel"

export default function AdminPanel() {
  const navigate = useNavigate()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [toasts, setToasts] = useState([])
  
  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }

  const handleLogout = () => {
    localStorage.removeItem("agn_admin_user")
    localStorage.removeItem("agn_admin_authenticated")
    showToast("success", "Logged out successfully")
    setTimeout(() => navigate('/'), 1000)
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
          sidebarExpanded ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out flex flex-col fixed h-screen z-50 shadow-2xl`}
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
                    ? 'bg-yellow-400 text-black border-l-4 border-yellow-600'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                } ${!sidebarExpanded && 'justify-center px-0'}`}
              >
                <Icon size={22} className={sidebarExpanded ? '' : 'mx-auto'} />
                {sidebarExpanded && (
                  <span className="font-bold text-sm">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition rounded-lg ${
              !sidebarExpanded && 'justify-center px-0'
            }`}
          >
            <LogOut size={22} className={sidebarExpanded ? '' : 'mx-auto'} />
            {sidebarExpanded && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 ${sidebarExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300 min-h-screen flex flex-col`}>
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-black">
                {menuItems.find(item => item.id === activeSection)?.label || 'Admin Panel'}
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
        <main className="p-8 flex-1 overflow-y-auto">
          {activeSection === "dashboard" && (
            <div>
              {/* Dashboard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={32} />
                    <span className="text-3xl font-black">234</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Total Employees</h3>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 size={32} />
                    <span className="text-3xl font-black">48</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Active Companies</h3>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <FileText size={32} />
                    <span className="text-3xl font-black">12</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">Pending Requests</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <Download size={32} />
                    <span className="text-3xl font-black">156</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">CVs Processed</h3>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h3 className="text-xl font-black text-black mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">New employee added</p>
                        <p className="text-xs text-gray-500">John Doe - Software Engineer</p>
                      </div>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Company registered</p>
                        <p className="text-xs text-gray-500">TechCorp Solutions</p>
                      </div>
                      <span className="text-xs text-gray-400">5h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FileText size={20} className="text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Hire request received</p>
                        <p className="text-xs text-gray-500">Finance Manager position</p>
                      </div>
                      <span className="text-xs text-gray-400">1d ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h3 className="text-xl font-black text-black mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveSection("employees")}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-left group"
                    >
                      <Users size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition" />
                      <p className="font-bold text-sm text-black">Add Employee</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("companies")}
                      className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition text-left group"
                    >
                      <Building2 size={24} className="text-green-600 mb-2 group-hover:scale-110 transition" />
                      <p className="font-bold text-sm text-black">Add Company</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("hire-requests")}
                      className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition text-left group"
                    >
                      <FileText size={24} className="text-yellow-600 mb-2 group-hover:scale-110 transition" />
                      <p className="font-bold text-sm text-black">View Requests</p>
                    </button>
                    <button
                      onClick={() => setActiveSection("settings")}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition text-left group"
                    >
                      <Settings size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition" />
                      <p className="font-bold text-sm text-black">Settings</p>
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
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transform transition-all duration-200 ${
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
