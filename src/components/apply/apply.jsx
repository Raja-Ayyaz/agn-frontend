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
    setCvFile(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.name || !formData.email || !formData.mobile_no) {
      setError("Please fill in all required fields (Name, Email, Mobile Number)")
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
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    fetch("http://localhost:8000/insert_employee", {
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
        clearTimeout(timeoutId)
        setIsLoading(false)
        if (error.name === "AbortError") {
          setError("Request timeout. Please check your connection and try again.")
        } else if (error.message.includes("Failed to fetch")) {
          setError("Unable to connect to server. Please ensure the backend is running and try again.")
        } else {
          setError("Failed to submit application. Please try again or contact support.")
        }
        console.error("Error:", error)
      })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Shared Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
            Apply for Your Next Finance Role
          </h1>
          <p
            className="text-lg text-black mb-2 max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "0.2s" }}
          >
            Join our network of finance professionals. Fill out the form below and let's find your perfect opportunity.
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, label: "Fast Process", value: "3-5 Days", delay: "0s" },
              { icon: Target, label: "Success Rate", value: "92%", delay: "0.1s" },
              { icon: Clock, label: "Avg Response", value: "24 Hours", delay: "0.2s" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: stat.delay }}
              >
                <stat.icon size={32} className="text-black mx-auto mb-3" />
                <p className="text-black font-black text-sm mb-1">{stat.label}</p>
                <p className="text-black font-black text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-black mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            Why Apply with AGN Job Bank?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: "Exclusive Opportunities",
                desc: "Access premium finance roles not listed elsewhere",
                delay: "0s",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                desc: "Work with industry leaders and advance your career",
                delay: "0.1s",
              },
              {
                icon: Award,
                title: "Competitive Packages",
                desc: "Attractive salaries and comprehensive benefits",
                delay: "0.2s",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-yellow-400 animate-in fade-in slide-in-from-bottom-4 duration-700 group"
                style={{ animationDelay: item.delay }}
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                  <item.icon size={28} className="text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-3">{item.title}</h3>
                <p className="text-gray-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {submitted && (
            <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-500 zoom-in">
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-400 rounded-2xl p-8 flex items-start gap-4 shadow-2xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 animate-pulse"></div>
                <div
                  className="absolute top-2 right-4 w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute top-8 right-12 w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute top-4 right-20 w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>

                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-bounce relative z-10 shadow-lg">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="flex-1 relative z-10">
                  <h3
                    className="font-black text-green-900 text-xl mb-2 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: "0.1s" }}
                  >
                    🎉 Application Submitted Successfully!
                  </h3>
                  <p
                    className="text-green-800 font-medium mb-2 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Thank you for applying. We'll review your application and get in touch soon with next steps.
                  </p>
                  <p
                    className="text-sm text-green-700 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: "0.3s" }}
                  >
                    Expected response time: 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
              <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-400 rounded-2xl p-8 flex items-start gap-4 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-400/10 animate-pulse"></div>
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse relative z-10 shadow-lg">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div className="flex-1 relative z-10">
                  <h3 className="font-black text-red-900 text-xl mb-2">⚠️ Submission Error</h3>
                  <p className="text-red-800 font-medium mb-2">{error}</p>
                  <p className="text-sm text-red-700">
                    💡 Tip: Make sure all required fields are filled and your internet connection is stable.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black shadow-md hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  1
                </span>
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="John Smith"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="28"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="07700 000000"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="Office #6, 2nd Floor, Sitara Plaza, Near Mediacom, Kohinoor Chowk, Faisalabad"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Nearest Route
                  </label>
                  <input
                    type="text"
                    name="nearest_route"
                    value={formData.nearest_route}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="e.g., M5, M6"
                  />
                </div>
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    CNIC/ID Number *
                  </label>
                  <input
                    type="text"
                    name="cnic_no"
                    value={formData.cnic_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="12345-6789012-3"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black shadow-md hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  2
                </span>
                Education
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Educational Profile *
                  </label>
                  <input
                    type="text"
                    name="educational_profile"
                    value={formData.educational_profile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="e.g., Bachelor's in Accounting"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Recent Completed Education *
                  </label>
                  <input
                    type="text"
                    name="recent_completed_education"
                    value={formData.recent_completed_education}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="e.g., ACCA, ACA, CIMA"
                  />
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black shadow-md hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  3
                </span>
                Experience
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Position Applying For *
                  </label>
                  <input
                    type="text"
                    name="applying_for"
                    value={formData.applying_for}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="e.g., Senior Accountant"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-black text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                  Experience Details
                </label>
                <textarea
                  name="experience_detail"
                  value={formData.experience_detail}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-all duration-300 font-medium resize-none hover:border-gray-400 focus:scale-105 focus:shadow-lg group-hover:border-yellow-300"
                  placeholder="Tell us about your relevant experience, key achievements, and why you're interested in this role..."
                />
              </div>
            </div>

            {/* CV Upload Section */}
            <div
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black shadow-md hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  4
                </span>
                Upload CV
              </h2>
              <div className="border-2 border-dashed border-yellow-400 rounded-xl p-8 text-center hover:bg-yellow-100 transition-all duration-300 cursor-pointer relative group">
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <Upload
                    size={40}
                    className="mx-auto mb-3 text-yellow-600 group-hover:text-yellow-700 group-hover:animate-bounce"
                  />
                </div>
                <p className="font-black text-black text-lg mb-1">
                  {cvFile ? cvFile.name : "Drop your CV here or click to browse"}
                </p>
                <p className="text-sm text-gray-600">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>
            </div>

            {/* Submit button */}
            <div
              className="flex gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-yellow-400 hover:bg-gray-900 font-black text-base px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-base px-6 py-3 rounded-lg bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-black mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            Success Stories from Our Candidates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Senior Accountant",
                company: "KPMG",
                testimonial: "AGN Job Bank helped me land my dream role. The process was smooth and professional.",
                delay: "0s",
              },
              {
                name: "Michael Chen",
                role: "Finance Manager",
                company: "Deloitte",
                testimonial: "Excellent support throughout the application process. Highly recommended!",
                delay: "0.1s",
              },
              {
                name: "Emma Williams",
                role: "Tax Specialist",
                company: "EY",
                testimonial: "Within 2 weeks of applying, I had my job offer. Amazing experience!",
                delay: "0.2s",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-yellow-400 animate-in fade-in slide-in-from-bottom-4 duration-700 group"
                style={{ animationDelay: testimonial.delay }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400 group-hover:scale-125 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 font-medium mb-6 italic">"{testimonial.testimonial}"</p>
                <div className="border-t-2 border-gray-200 pt-4">
                  <p className="font-black text-black">{testimonial.name}</p>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-black mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            About AGN Job Bank
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 border-2 border-yellow-300 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-lg transition-shadow duration-300 group">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-3 group-hover:text-yellow-600 transition-colors duration-300">
                <Users size={28} className="text-yellow-600 group-hover:scale-125 transition-transform duration-300" />
                Our Mission
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                We connect talented finance professionals with leading organizations across the UK. With over 15 years
                of experience in recruitment, we understand what both employers and candidates need to succeed.
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-lg transition-shadow duration-300 group"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-3 group-hover:text-yellow-600 transition-colors duration-300">
                <Award size={28} className="text-black group-hover:scale-125 transition-transform duration-300" />
                Why Choose Us
              </h3>
              <ul className="space-y-3 text-gray-700 font-medium">
                <li className="flex items-center gap-2 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full group-hover/item:scale-150 transition-transform duration-300"></span>
                  Personalized recruitment support
                </li>
                <li className="flex items-center gap-2 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full group-hover/item:scale-150 transition-transform duration-300"></span>
                  Access to exclusive opportunities
                </li>
                <li className="flex items-center gap-2 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full group-hover/item:scale-150 transition-transform duration-300"></span>
                  Fast-track interview process
                </li>
                <li className="flex items-center gap-2 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full group-hover/item:scale-150 transition-transform duration-300"></span>
                  Dedicated career guidance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300 cursor-pointer hover:rotate-12">
                <span className="text-black font-black text-lg">AGN</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">AGN job bank</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Specialists in financial recruitment, connecting talent with opportunity.
              </p>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/#about"
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/apply"
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    Apply
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 cursor-pointer group">
                  <Phone
                    size={18}
                    className="text-yellow-400 group-hover:scale-125 transition-transform duration-300"
                  />
                  <a href="tel:01216511235" className="hover:text-yellow-400 transition">
                    +92 3037774400
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 cursor-pointer group">
                  <Mail size={18} className="text-yellow-400 group-hover:scale-125 transition-transform duration-300" />
                  <a href="mailto:agnjobbank123@gmail.com" className="hover:text-yellow-400 transition">
                    agnjobbank123@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 group">
                  <MapPin
                    size={18}
                    className="text-yellow-400 group-hover:scale-125 transition-transform duration-300"
                  />
                  <span>Office #6, 2nd Floor, Sitara Plaza, Near Mediacom, Kohinoor Chowk, Faisalabad</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-125 hover:shadow-lg"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-125 hover:shadow-lg"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 AGN job bank Recruitment. All rights reserved.</p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-all duration-300 text-sm font-medium hover:translate-y-[-2px]"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-all duration-300 text-sm font-medium hover:translate-y-[-2px]"
                >
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
