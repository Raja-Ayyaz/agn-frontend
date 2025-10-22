"use client"

import { ArrowRight, Menu, X, Phone, Mail, Linkedin, Twitter, Upload, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null)
  const navigate = useNavigate()

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login submitted:", { username, password })
    // navigate to employer dashboard after login (mock)
    try {
      navigate('/employer-dashboard')
    } catch (err) {
      console.warn('Navigation failed', err)
    }
  }

  // Sample transaction data
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">MA</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">MITCHELL ADAM</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-black font-bold hover:opacity-70 transition text-sm">
              HOME
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              APPLY
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              HIRE
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              CONTACT
            </a>
          </div>
          <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-yellow-400 border-t-2 border-black">
            <div className="px-4 py-4 space-y-3">
              <a href="/" className="block text-black font-bold hover:opacity-70 transition">
                HOME
              </a>
              <a href="#" className="block text-black font-bold hover:opacity-70 transition">
                APPLY
              </a>
              <a href="#" className="block text-black font-bold hover:opacity-70 transition">
                HIRE
              </a>
              <a href="#" className="block text-black font-bold hover:opacity-70 transition">
                CONTACT
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Login */}
      <section className="bg-yellow-400 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-6 text-balance">
                Welcome Back
              </h1>
              <p className="text-lg text-black mb-8 max-w-md leading-relaxed font-medium">
                Access your Mitchell Adam recruitment dashboard to manage placements, track candidates, and grow your
                business.
              </p>

              {/* Company Info Boxes */}
              <div className="space-y-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-black/10">
                  <h3 className="font-black text-black mb-2">Why Choose Mitchell Adam?</h3>
                  <p className="text-sm text-gray-700">
                    10+ years of expertise in financial recruitment with 500+ successful placements
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-black/10">
                  <h3 className="font-black text-black mb-2">Dedicated Support</h3>
                  <p className="text-sm text-gray-700">24/7 support team ready to assist with your recruitment needs</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
              <h2 className="text-3xl font-black text-black mb-6">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border-2 border-white/50 text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border-2 border-white/50 text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-black hover:opacity-70 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-2 border-black" />
                    <span className="font-bold text-black">Remember me</span>
                  </label>
                  <a href="#" className="font-bold text-black hover:opacity-70 transition">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg py-3 rounded-lg transition transform hover:scale-105"
                >
                  Login <ArrowRight className="inline ml-2" size={20} />
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-black font-medium">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => navigate('/hire')} className="font-black hover:opacity-70 transition">
                    Sign up here
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Upload Company Logo</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">Add your company branding to your profile</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="bg-white rounded-2xl p-8 border-4 border-dashed border-yellow-400 hover:border-black transition cursor-pointer">
              <label className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Upload size={32} className="text-black" />
                </div>
                <div className="text-center">
                  <p className="font-black text-black text-lg mb-1">Click to upload</p>
                  <p className="text-gray-600 text-sm">or drag and drop</p>
                  <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 flex items-center justify-center">
              {uploadedImage ? (
                <div className="text-center">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded"
                    className="max-w-full max-h-64 rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600 font-medium">Image uploaded successfully!</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <p className="text-gray-600 font-medium">Your image preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Recent Activity</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">Track your recent placements and activities</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-4 px-4 font-black text-black">Type</th>
                  <th className="text-left py-4 px-4 font-black text-black">Candidate</th>
                  <th className="text-left py-4 px-4 font-black text-black">Company</th>
                  <th className="text-left py-4 px-4 font-black text-black">Date</th>
                  <th className="text-left py-4 px-4 font-black text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200 hover:bg-yellow-50 transition">
                    <td className="py-4 px-4">
                      <span className="bg-yellow-100 text-black font-black px-3 py-1 rounded-full text-sm">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-black">{transaction.candidate}</td>
                    <td className="py-4 px-4 text-gray-600">{transaction.company}</td>
                    <td className="py-4 px-4 text-gray-600">{transaction.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-black px-3 py-1 rounded-full text-sm ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "Scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-balance">About Mitchell Adam</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl">
                📊
              </div>
              <h3 className="text-2xl font-black text-black mb-3">Our Expertise</h3>
              <p className="text-gray-600 leading-relaxed">
                Specializing in financial recruitment with over a decade of experience connecting top talent with
                leading organizations across the UK.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl">
                🎯
              </div>
              <h3 className="text-2xl font-black text-black mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide honest, transparent recruitment services that help candidates advance their careers and
                employers find exceptional finance professionals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl">
                🤝
              </div>
              <h3 className="text-2xl font-black text-black mb-3">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in building lasting relationships, maintaining integrity, and delivering exceptional results
                for every client and candidate we work with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-black text-lg">MA</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Mitchell Adam</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Specialists in financial recruitment, connecting talent with opportunity.
              </p>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Apply
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Hire
                  </a>
                </li>
              </ul>
            </div>

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
                  <a href="mailto:info@mitchelladam.co.uk" className="hover:text-yellow-400 transition">
                    info@mitchelladam.co.uk
                  </a>
                </li>
              </ul>
            </div>

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

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm">© 2025 Mitchell Adam Recruitment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
