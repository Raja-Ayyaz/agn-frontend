"use client"

import {
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Upload,
  CheckCircle,
  AlertCircle,
  Home,
  Info,
  MessageSquare,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Star,
  Zap,
  Target,
  Clock,
} from "lucide-react"
import { useState } from "react"
import NavBar from "../shared/NavBar"
import CONFIG from "../../Api/Config/config"

export default function ApplyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile_no: "",
    location: "",
    nearest_route: "",
    cnic_no: "",
    educational_profile: "",
    recent_completed_education: "",
    applying_for: "",
    experience: "",
    experience_detail: "",
  })
  const [cvFile, setCvFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setCvFile(null)
      return
    }
    // Validate file type and size (5MB max)
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowed.includes(file.type) && !/\.pdf$|\.docx?$/.test(file.name.toLowerCase())) {
      setError("Only PDF or Word files are allowed (PDF, DOC, DOCX).")
      setCvFile(null)
      showToast("error", "Please upload a PDF or Word document (DOC/DOCX)")
      return
    }
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      setError("File too large. Maximum allowed size is 5MB.")
      setCvFile(null)
      showToast("error", "File too large — maximum 5MB")
      return
    }
    setError(null)
    setCvFile(file)
  }

  // Simple toast system
  const [toasts, setToasts] = useState([])
  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, duration)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.name || !formData.email || !formData.mobile_no) {
      setError("Please fill in all required fields (Name, Email, Mobile Number)")
      showToast("error", "Please fill in required fields: Name, Email, Mobile Number")
      setIsLoading(false)
      return
    }

    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key])
    })
    if (cvFile) {
      data.append("cv", cvFile)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

    fetch(`${CONFIG.BASE_URL}/insert_employee`, {
      method: "POST",
      body: data,
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId)
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }
        return response.json()
      })
      .then((result) => {
        setIsLoading(false)
        setSubmitted(true)
        showToast("success", "Application submitted successfully")
        setFormData({
          name: "",
          age: "",
          email: "",
          mobile_no: "",
          location: "",
          nearest_route: "",
          cnic_no: "",
          educational_profile: "",
          recent_completed_education: "",
          applying_for: "",
          experience: "",
          experience_detail: "",
        })
        setCvFile(null)
        setTimeout(() => setSubmitted(false), 6000)
      })
      .catch((error) => {
        setIsLoading(false)
        if (error.name === "AbortError") {
          setError("Request timeout. Please check your connection and try again.")
          showToast("error", "Request timeout — please try again")
        } else if (error.message.includes("Failed to fetch")) {
          setError("Unable to connect to server. Please ensure the backend is running and try again.")
          showToast("error", "Unable to connect to server")
        } else {
          setError("Failed to submit application. Please try again or contact support.")
          showToast("error", "Failed to submit application")
        }
        console.error("Error:", error)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Shared Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
            Apply for Your Next Finance Role
          </h1>
          <p className="text-lg md:text-xl text-black/90 max-w-3xl mx-auto leading-relaxed">
            Join our network of finance professionals. Fill out the form below and let's find your perfect opportunity.
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, label: "Fast Process", value: "3-5 Days" },
              { icon: Target, label: "Success Rate", value: "92%" },
              { icon: Clock, label: "Avg Response", value: "24 Hours" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 text-center border border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all duration-300"
              >
                <stat.icon size={28} className="text-yellow-600 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold text-sm mb-1">{stat.label}</p>
                <p className="text-black font-bold text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Apply Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            Why Apply with AGN Job Bank?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We're committed to helping finance professionals find their ideal career opportunities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: "Exclusive Opportunities",
                desc: "Access premium finance roles not listed elsewhere",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                desc: "Work with industry leaders and advance your career",
              },
              {
                icon: Award,
                title: "Competitive Packages",
                desc: "Attractive salaries and comprehensive benefits",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {submitted && (
            <div className="mb-8 bg-green-50 border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 text-lg mb-1">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-green-800 mb-2">
                    Thank you for applying. We'll review your application and get in touch soon with next steps.
                  </p>
                  <p className="text-sm text-green-700">
                    Expected response time: 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-lg mb-1">Submission Error</h3>
                  <p className="text-red-800 mb-2">{error}</p>
                  <p className="text-sm text-red-700">
                    Please ensure all required fields are filled and your internet connection is stable.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">1</span>
                </div>
                <h2 className="text-2xl font-bold text-black">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="28"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="07700 000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nearest Route
                  </label>
                  <input
                    type="text"
                    name="nearest_route"
                    value={formData.nearest_route}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., M5, M6"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC/ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnic_no"
                    value={formData.cnic_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="12345-6789012-3"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">2</span>
                </div>
                <h2 className="text-2xl font-bold text-black">Education</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Educational Profile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="educational_profile"
                    value={formData.educational_profile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Bachelor's in Accounting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recent Completed Education <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recent_completed_education"
                    value={formData.recent_completed_education}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., ACCA, ACA, CIMA"
                  />
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">3</span>
                </div>
                <h2 className="text-2xl font-bold text-black">Experience</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position Applying For <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applying_for"
                    value={formData.applying_for}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Senior Accountant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    placeholder="5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Details
                </label>
                <textarea
                  name="experience_detail"
                  value={formData.experience_detail}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your relevant experience, key achievements, and why you're interested in this role..."
                />
              </div>
            </div>

            {/* CV Upload Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">4</span>
                </div>
                <h2 className="text-2xl font-bold text-black">Upload CV</h2>
              </div>
              <div className="relative">
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center bg-white hover:bg-yellow-50 transition-colors cursor-pointer">
                  <Upload size={40} className="mx-auto mb-3 text-yellow-600" />
                  <p className="font-semibold text-black text-lg mb-1">
                    {cvFile ? cvFile.name : "Drop your CV here or click to browse"}
                  </p>
                  <p className="text-sm text-gray-600">PDF, DOC, or DOCX (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-semibold text-base px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-black hover:text-black font-semibold text-base px-6 py-4 rounded-lg bg-white transition-all duration-300 hover:shadow-lg"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            Success Stories from Our Candidates
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            See what our successful candidates have to say about their experience with AGN Job Bank
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Senior Accountant",
                company: "KPMG",
                testimonial: "AGN Job Bank helped me land my dream role. The process was smooth and professional.",
              },
              {
                name: "Michael Chen",
                role: "Finance Manager",
                company: "Deloitte",
                testimonial: "Excellent support throughout the application process. Highly recommended!",
              },
              {
                name: "Emma Williams",
                role: "Tax Specialist",
                company: "EY",
                testimonial: "Within 2 weeks of applying, I had my job offer. Amazing experience!",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-sm leading-relaxed">"{testimonial.testimonial}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-black">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            About AGN Job Bank
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Your trusted partner in finance recruitment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8 border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <Users size={24} className="text-yellow-600" />
                <h3 className="text-xl font-bold text-black">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We connect talented finance professionals with leading organizations across the UK. With over 15 years
                of experience in recruitment, we understand what both employers and candidates need to succeed.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Award size={24} className="text-black" />
                <h3 className="text-xl font-bold text-black">Why Choose Us</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Personalized recruitment support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Access to exclusive opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fast-track interview process</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dedicated career guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                <span className="text-black font-bold text-lg">AGN</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AGN job bank</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Specialists in financial recruitment, connecting talent with opportunity.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/#about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="/apply" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Apply
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={16} className="text-yellow-400 flex-shrink-0" />
                  <a href="tel:+923037774400" className="hover:text-yellow-400 transition-colors">
                    +92 3037774400
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                  <a href="mailto:agnjobbank123@gmail.com" className="hover:text-yellow-400 transition-colors">
                    agnjobbank123@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Office #6, 2nd Floor, Sitara Plaza, Near Mediacom, Kohinoor Chowk, Faisalabad</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 AGN job bank Recruitment. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast container */}
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white transform transition-all duration-300 ${
              t.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
