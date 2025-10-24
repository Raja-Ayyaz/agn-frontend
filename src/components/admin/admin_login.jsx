import React, { useState } from "react"
import { Eye, EyeOff, ArrowRight, Menu, X, Phone, Mail, MapPin, Linkedin, Twitter } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Please provide username and password")
      return
    }

    try {
      localStorage.setItem("agn_admin_user", username)
      localStorage.setItem("agn_admin_authenticated", "1")
      setSuccess(true)
      // redirect to the admin panel route in this app
      setTimeout(() => {
        navigate('/admin/panel')
      }, 400)
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">AGN</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">AGN job bank</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-black font-bold hover:opacity-70 transition text-sm">
              HOME
            </Link>
            <Link to="/apply" className="text-black font-bold hover:opacity-70 transition text-sm">
              APPLY
            </Link>
            <Link to="/hire" className="text-black font-bold hover:opacity-70 transition text-sm">
              HIRE
            </Link>
          </div>
          <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-yellow-400 border-t-2 border-black">
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block text-black font-bold hover:opacity-70 transition">
                HOME
              </Link>
              <Link to="/apply" className="block text-black font-bold hover:opacity-70 transition">
                APPLY
              </Link>
              <Link to="/hire" className="block text-black font-bold hover:opacity-70 transition">
                HIRE
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4 text-balance">Admin Access</h1>
            <p className="text-lg text-black max-w-2xl mx-auto leading-relaxed font-medium">
              Secure login for AGN administrators to manage recruitment operations
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-delay">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-6 leading-tight text-balance">
                Manage Your <br />
                <span className="text-yellow-400">Recruitment</span> <br />
                Operations
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Access the admin dashboard to manage candidates, job postings, applications, and track recruitment
                metrics in real-time.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 transition">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-black">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-black text-black mb-1">Candidate Management</h3>
                    <p className="text-sm text-gray-600">
                      View, filter, and manage all candidate profiles and applications
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 transition">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-black">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-black text-black mb-1">Job Postings</h3>
                    <p className="text-sm text-gray-600">
                      Create, edit, and manage active job listings across all levels
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 transition">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-black">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-black text-black mb-1">Analytics & Reports</h3>
                    <p className="text-sm text-gray-600">
                      Track recruitment metrics and generate comprehensive reports
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="animate-fade-in-delay-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-xl border-2 border-yellow-400 hover:shadow-2xl transition">
                <h3 className="text-2xl font-black text-black mb-6">Admin Login</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-black text-black mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition bg-white font-medium"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-black text-black mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3 text-gray-600 hover:text-black transition"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-sm font-bold text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-sm font-bold text-green-600">✓ Login successful! Redirecting...</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-black text-yellow-400 font-black py-3 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 group"
                  >
                    Login to Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </button>

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("")
                      setPassword("")
                      setError("")
                    }}
                    className="w-full border-2 border-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-100 transition"
                  >
                    Clear Fields
                  </button>
                </form>

                <p className="text-xs text-gray-600 mt-6 text-center">
                  Frontend-only login for testing. Use any non-empty credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance text-center">
            Admin Dashboard Features
          </h2>
          <p className="text-gray-600 mb-12 text-lg font-medium text-center max-w-2xl mx-auto">
            Comprehensive tools to manage your recruitment operations efficiently
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Analytics",
                description: "Monitor recruitment metrics, conversion rates, and performance indicators",
                icon: "📊",
              },
              {
                title: "Candidate Database",
                description: "Search, filter, and manage thousands of candidate profiles efficiently",
                icon: "👥",
              },
              {
                title: "Job Management",
                description: "Create, publish, and manage job postings across all career levels",
                icon: "💼",
              },
              {
                title: "Application Tracking",
                description: "Track applications through each stage of the recruitment pipeline",
                icon: "📋",
              },
              {
                title: "Team Collaboration",
                description: "Share notes, feedback, and collaborate with your recruitment team",
                icon: "🤝",
              },
              {
                title: "Export & Reports",
                description: "Generate detailed reports and export data in multiple formats",
                icon: "📈",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-black text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8 text-balance">Need Admin Access?</h2>
          <p className="text-black text-lg mb-8 max-w-2xl mx-auto font-medium">
            Contact our team to request administrator credentials for the recruitment dashboard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:01216511235"
              className="bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-4 rounded-lg transition flex items-center justify-center gap-2 group"
            >
              <Phone size={20} />
              Call Us
            </a>
            <a
              href="mailto:info@agnjobbank.com"
              className="border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-4 rounded-lg transition flex items-center justify-center gap-2 group"
            >
              <Mail size={20} />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-black text-lg">AGN</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">AGN job bank</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Specialists in financial recruitment, connecting talent with opportunity.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/apply" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Apply
                  </Link>
                </li>
                <li>
                  <Link to="/hire" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Hire
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-black text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone size={18} className="text-yellow-400" />
                  <a href="tel:01216511235" className="hover:text-yellow-400 transition">
                    0121 651 1235
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail size={18} className="text-yellow-400" />
                  <a href="mailto:info@agnjobbank.com" className="hover:text-yellow-400 transition">
                    info@agnjobbank.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} className="text-yellow-400" />
                  <span>Birmingham, UK</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-black text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 AGN job bank Recruitment. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-sm font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-sm font-medium">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
