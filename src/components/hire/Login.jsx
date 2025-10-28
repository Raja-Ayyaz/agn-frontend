"use client"

import {
  ArrowRight,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Eye,
  EyeOff,
  TrendingUp,
  Target,
  Handshake,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../shared/NavBar"

export default function Login() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const transactions = [
    {
      id: 1,
      type: "Placement",
      candidate: "John Smith",
      company: "Acme Corp",
      date: "2025-10-15",
      status: "Completed",
    },
    {
      id: 2,
      type: "Interview",
      candidate: "Sarah Johnson",
      company: "Tech Solutions",
      date: "2025-10-14",
      status: "Scheduled",
    },
    { id: 3, type: "Offer", candidate: "Michael Brown", company: "Finance Ltd", date: "2025-10-13", status: "Pending" },
    {
      id: 4,
      type: "Placement",
      candidate: "Emma Davis",
      company: "Global Bank",
      date: "2025-10-12",
      status: "Completed",
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login submitted:", { username, password })
    try {
      navigate("/employer-dashboard")
    } catch (err) {
      console.warn("Navigation failed", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <NavBar />

      {/* Hero Section with Login */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-50 -z-10"></div>

        {/* Animated decorative elements */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-amber-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-32 w-64 h-64 bg-amber-100 rounded-full opacity-15 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -left-32 top-40 w-80 h-80 bg-amber-50 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight text-balance">
                  Welcome Back
                </h1>
                <p className="text-lg text-slate-600 max-w-md leading-relaxed font-medium">
                  Access your AGN job bank recruitment dashboard to manage placements, track candidates, and grow your
                  business.
                </p>
              </div>

              {/* Company Info Boxes */}
              <div className="space-y-3">
                <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                      <TrendingUp size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Why Choose AGN job bank?</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        10+ years of expertise in financial recruitment with 500+ successful placements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                      <Handshake size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Dedicated Support</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        24/7 support team ready to assist with your recruitment needs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form Card */}
            <div
              className="group bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-3xl font-black text-slate-900 mb-6">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border border-slate-300 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-700 group-hover/checkbox:text-slate-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 font-bold text-sm py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Login <ArrowRight size={16} />
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-xs font-medium">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/employer-signup")}
                    className="font-bold rounded-md duration-200"
                  >
                    Sign up as an employer
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 text-balance">Recent Activity</h2>
            <p className="text-slate-600 text-lg font-medium">Track your recent placements and activities</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900 text-sm">Type</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900 text-sm">Candidate</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900 text-sm">Company</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900 text-sm">Date</th>
                  <th className="text-left py-4 px-4 font-bold text-slate-900 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, idx) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 hover:bg-amber-50/50 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <td className="py-4 px-4">
                      <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs inline-block">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 text-sm">{transaction.candidate}</td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{transaction.company}</td>
                    <td className="py-4 px-4 text-slate-600 text-sm">{transaction.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {transaction.status === "Completed" && (
                          <>
                            <CheckCircle2 size={16} className="text-green-600" />
                            <span className="font-bold text-green-700 text-xs bg-green-100 px-3 py-1 rounded-full">
                              {transaction.status}
                            </span>
                          </>
                        )}
                        {transaction.status === "Scheduled" && (
                          <>
                            <Clock size={16} className="text-blue-600" />
                            <span className="font-bold text-blue-700 text-xs bg-blue-100 px-3 py-1 rounded-full">
                              {transaction.status}
                            </span>
                          </>
                        )}
                        {transaction.status === "Pending" && (
                          <>
                            <AlertCircle size={16} className="text-amber-600" />
                            <span className="font-bold text-amber-700 text-xs bg-amber-100 px-3 py-1 rounded-full">
                              {transaction.status}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 text-balance animate-fade-in">
            About AGN job bank
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Our Expertise",
                desc: "Specializing in financial recruitment with over a decade of experience connecting top talent with leading organizations across the UK.",
              },
              {
                icon: Target,
                title: "Our Mission",
                desc: "To provide honest, transparent recruitment services that help candidates advance their careers and employers find exceptional finance professionals.",
              },
              {
                icon: Handshake,
                title: "Our Values",
                desc: "We believe in building lasting relationships, maintaining integrity, and delivering exceptional results for every client and candidate we work with.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl p-8 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px] animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-300">
                  <item.icon size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-black text-sm">AGN</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">AGN job bank</h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-2">
                  Specialists in financial recruitment, connecting talent with opportunity.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-black text-white mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Apply", "Hire"].map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4 text-sm">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors duration-200 group cursor-pointer">
                  <Phone size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <a href="tel:01216511235" className="text-sm font-medium">
                    +92 3037774400
                  </a>
                </li>
                <li className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors duration-200 group cursor-pointer">
                  <Mail size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <a href="mailto:agnjobbank123@gmail.com" className="text-sm font-medium">
                    agnjobbank123@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4 text-sm">Follow Us</h4>
              <div className="flex gap-3">
                {[Linkedin, Twitter].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-400 text-xs">© 2025 AGN job bank Recruitment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
