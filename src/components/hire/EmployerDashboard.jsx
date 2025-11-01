"use client"

import {
  ArrowRight,
  X,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Zap,
  Shield,
  FileText,
  Download,
  Clock,
  AlertCircle,
  XCircle,
  Home,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../shared/NavBar"
import { listEmployees, createHireRequest, getEmployerHireRequests } from '../../Api/Service/apiService'

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [experience, setExperience] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [experienceOptions, setExperienceOptions] = useState([])
  const [fieldOptions, setFieldOptions] = useState([])
  const [expandedCandidate, setExpandedCandidate] = useState(null)
  const [hireModalOpen, setHireModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hireMessage, setHireMessage] = useState("")
  const [submittingHire, setSubmittingHire] = useState(false)
  const [requestsModalOpen, setRequestsModalOpen] = useState(false)
  const [hireRequests, setHireRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('employerData')
    localStorage.removeItem('employerId')
    sessionStorage.clear()
    // Redirect to home page
    navigate('/')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Query backend for matching employees by role (field) and experience
    ;(async () => {
      try {
        const params = {}
        if (jobTitle) {
          // if the user typed a partial role (e.g. "Software"), prefer the full role
          // from `fieldOptions` that startsWith the typed text (case-insensitive).
          const typed = String(jobTitle || "").trim()
          const match = (fieldOptions || []).find((f) =>
            String(f || "").toLowerCase().startsWith(typed.toLowerCase())
          )
          params.role = match || jobTitle
        }
        if (experience) params.experience = experience
        const res = await listEmployees(params)
        if (res && res.ok) {
          const rows = res.rows || []
          setSearchResults({
            jobTitle,
            experience,
            count: rows.length,
            timestamp: new Date().toLocaleTimeString(),
            rows,
          })
        } else {
          setSearchResults({ jobTitle, experience, count: 0, timestamp: new Date().toLocaleTimeString(), rows: [] })
        }
      } catch (err) {
        console.error("Search error", err)
        setSearchResults({ jobTitle, experience, count: 0, timestamp: new Date().toLocaleTimeString(), rows: [] })
      }
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 700)
    })()
  }

  // Convert experience string from DB into years representation
  function toYearsLabel(exp) {
    if (!exp && exp !== 0) return ""
    const s = String(exp)
    // try to find first number in the string
    const m = s.match(/\d+/)
    if (m) {
      const n = parseInt(m[0], 10)
      return n === 1 ? "1 year" : `${n} years`
    }
    // treat fresh/no experience as 0 years so it appears in the dropdown
    const low = s.toLowerCase()
    if (low.includes('fresh') || low.includes('fresher') || low.includes('no professional') || low.includes('no experience')) {
      return '0 years'
    }
    return s
  }

  // load options on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // fetch a large sample (adjust limit if needed)
        const res = await listEmployees({ limit: 1000 })
        if (!mounted) return
        if (res && res.ok) {
          const rows = res.rows || []
          const expSet = new Set()
          const fieldSet = new Set()
          rows.forEach((r) => {
            if (r.experience) expSet.add(toYearsLabel(r.experience))
            if (r.field) fieldSet.add(r.field)
          })
          // sort experience options by numeric value when possible
          const expArr = Array.from(expSet).filter(Boolean).sort((a, b) => {
            const na = parseInt(a, 10) || 0
            const nb = parseInt(b, 10) || 0
            return na - nb
          })
          setExperienceOptions(expArr)
          setFieldOptions(Array.from(fieldSet).filter(Boolean).sort())
        }
      } catch (err) {
        console.error("Failed to load employee options", err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const clearResults = () => {
    setSearchResults(null)
    setJobTitle("")
    setExperience("")
  }

  const openHireModal = (candidate) => {
    setSelectedCandidate(candidate)
    setHireMessage("")
    setHireModalOpen(true)
  }

  const closeHireModal = () => {
    setHireModalOpen(false)
    setSelectedCandidate(null)
    setHireMessage("")
  }

  const handleHireSubmit = async () => {
    if (!hireMessage.trim()) {
      alert("Please enter a message for your hire request")
      return
    }

    setSubmittingHire(true)
    try {
      // Get employer_id from localStorage
      const employerId = localStorage.getItem('agn_employer_id')
      if (!employerId) {
        alert("Employer ID not found. Please login again.")
        return
      }

      const response = await createHireRequest({
        employer_id: parseInt(employerId),
        employee_id: selectedCandidate.employee_id,
        message: hireMessage.trim()
      })

      if (response && response.ok) {
        alert(`Hire request sent successfully for ${selectedCandidate.name}!`)
        closeHireModal()
      } else {
        alert(response?.error || "Failed to create hire request")
      }
    } catch (error) {
      console.error("Hire request error:", error)
      alert(error.message || "Failed to create hire request. Please try again.")
    } finally {
      setSubmittingHire(false)
    }
  }

  const openRequestsModal = async () => {
    setRequestsModalOpen(true)
    setLoadingRequests(true)
    try {
      const employerId = localStorage.getItem('agn_employer_id')
      if (!employerId) {
        alert("Employer ID not found. Please login again.")
        return
      }

      const response = await getEmployerHireRequests(parseInt(employerId))
      if (response && response.ok) {
        setHireRequests(response.requests || [])
      } else {
        alert(response?.error || "Failed to load hire requests")
      }
    } catch (error) {
      console.error("Load requests error:", error)
      alert("Failed to load hire requests. Please try again.")
    } finally {
      setLoadingRequests(false)
    }
  }

  const closeRequestsModal = () => {
    setRequestsModalOpen(false)
    setHireRequests([])
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      case 'accepted':
        return <CheckCircle className="text-green-600" size={20} />
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <AlertCircle className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Shared Navigation */}
      <NavBar />

      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Briefcase className="text-yellow-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-black text-black text-sm">Quick Search</h3>
              <p className="text-gray-600 text-xs">Find candidates instantly</p>
            </div>
            <button
              onClick={handleGoHome}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center gap-2"
            >
              <Home size={18} />
              Home
            </button>
            <button
              onClick={openRequestsModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center gap-2"
            >
              <FileText size={18} />
              My Requests
            </button>
            <button
              onClick={() => document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-black px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
            >
              Search Now
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-black text-black leading-tight mb-6 text-balance">
                Find Your Next{" "}
                <span className="relative inline-block">
                  Finance<span className="absolute -bottom-3 left-0 w-10 h-10 bg-black rounded-full"></span>
                </span>{" "}
                Professional
              </h1>
              <p className="text-lg text-black mb-8 max-w-md leading-relaxed font-medium">
                Access our network of vetted finance professionals ready to join your team
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="search-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Search Our Talent Pool</h2>
            <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
              Tell us what you're looking for and we'll help you find the perfect candidate
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-black text-black mb-2">Search Submitted!</h3>
                <p className="text-gray-700 mb-6">
                  We'll review your requirements and get back to you shortly with matching candidates.
                </p>
                <button
                  onClick={clearResults}
                  className="bg-black text-yellow-400 hover:bg-gray-900 font-black px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  New Search
                </button>
              </div>
            ) : (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <label className="block font-black text-black mb-3 text-sm">Job Title or Role</label>
                    <input
                      type="text"
                      list="field-options"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Accountant, Finance Manager"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition-all duration-200 font-medium hover:border-yellow-400"
                    />
                    <datalist id="field-options">
                      {(fieldOptions || [])
                        .filter((f) => {
                          if (!jobTitle) return true
                          try {
                            return String(f || "").toLowerCase().startsWith(String(jobTitle || "").toLowerCase())
                          } catch (e) {
                            return true
                          }
                        })
                        .map((f) => (
                          <option key={f} value={f} />
                        ))}
                    </datalist>
                  </div>

                  <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <label className="block font-black text-black mb-3 text-sm">Experience Level Required</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition-all duration-200 font-medium hover:border-yellow-400"
                    >
                      <option value="">Select experience level</option>
                      {experienceOptions.length > 0 ? (
                        experienceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="entry">Entry Level / Graduate</option>
                          <option value="part-qualified">Part Qualified</option>
                          <option value="qualified">Qualified Professional</option>
                          <option value="senior">Senior / Management</option>
                          <option value="executive">Executive / Director</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <span>Search Candidates</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {searchResults && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-black mb-2">Search Results</h3>
                  <p className="text-gray-600 text-sm">Found {searchResults.count} matching candidates</p>
                </div>
                <button onClick={clearResults} className="text-gray-500 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Job Title</p>
                  <p className="font-black text-black text-lg">{searchResults.jobTitle}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Experience Level</p>
                  <p className="font-black text-black text-lg capitalize">{searchResults.experience}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {(searchResults.rows || []).slice(0, Math.min(searchResults.rows.length, 6)).map((r, i) => {
                  const isExpanded = expandedCandidate === r.employee_id
                  return (
                    <div
                      key={r.employee_id || i}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-all duration-200 group"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedCandidate(isExpanded ? null : r.employee_id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="text-blue-500" size={18} />
                              <h4 className="font-black text-black">{r.name || `Candidate ${i + 1}`}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{r.field || 'Relevant role'}</p>
                            <div className="flex gap-2">
                              <span className="bg-blue-200 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                                {r.location || 'Location unknown'}
                              </span>
                              <span className="bg-green-200 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                                {r.experience ? toYearsLabel(r.experience) : 'Experience N/A'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            className={`text-blue-500 transition-transform ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                            size={20}
                          />
                        </div>
                      </div>

                      {/* Expanded section with CV and Hire button */}
                      {isExpanded && (
                        <div className="border-t border-blue-200 p-4 bg-white animate-fade-in">
                          <div className="space-y-4">
                            {/* Candidate Details */}
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              {r.educational_profile && (
                                <div className="flex items-center gap-2">
                                  <Award size={16} className="text-blue-500" />
                                  <span className="text-gray-700">{r.educational_profile}</span>
                                </div>
                              )}
                              {r.experience_detail && (
                                <div className="flex items-start gap-2 md:col-span-2">
                                  <Briefcase size={16} className="text-blue-500 mt-1" />
                                  <span className="text-gray-700">{r.experience_detail}</span>
                                </div>
                              )}
                            </div>

                          

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openHireModal(r)
                                }}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={18} />
                                Hire {r.name?.split(' ')[0]}
                              </button>
                              {r.masked_cv && (
                                <a
                                  href={r.masked_cv}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                  <FileText size={18} />
                                  Download CV
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                View All {searchResults.count} Candidates
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hire Request Modal */}
      {hireModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Send Hire Request</h3>
                  <p className="text-black text-sm font-semibold">
                    Request to hire {selectedCandidate.name}
                  </p>
                </div>
                <button
                  onClick={closeHireModal}
                  className="text-black hover:text-gray-700 transition-colors"
                  disabled={submittingHire}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Candidate Summary */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-blue-600" size={24} />
                  <div>
                    <h4 className="font-black text-black text-lg">{selectedCandidate.name}</h4>
                    <p className="text-sm text-gray-600">{selectedCandidate.field}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 font-semibold">Location:</span>
                    <p className="text-black font-bold">{selectedCandidate.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Experience:</span>
                    <p className="text-black font-bold">{toYearsLabel(selectedCandidate.experience)}</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block font-black text-black mb-3 text-sm">
                  Message / Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={hireMessage}
                  onChange={(e) => setHireMessage(e.target.value)}
                  placeholder="Enter your message or comments for this hire request..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-all duration-200 font-medium resize-none"
                  disabled={submittingHire}
                  required
                />
                <p className="text-gray-500 text-xs mt-2">
                  Please provide details about the position, salary expectations, or any other relevant information.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeHireModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-black py-3 px-4 rounded-lg transition-all duration-200"
                  disabled={submittingHire}
                >
                  Cancel
                </button>
                <button
                  onClick={handleHireSubmit}
                  disabled={submittingHire || !hireMessage.trim()}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submittingHire ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm & Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Requests Modal */}
      {requestsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">My Hire Requests</h3>
                  <p className="text-blue-100 text-sm font-semibold">
                    View all your hire requests and their current status
                  </p>
                </div>
                <button
                  onClick={closeRequestsModal}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingRequests ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : hireRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                  <h4 className="text-xl font-black text-gray-700 mb-2">No Hire Requests Yet</h4>
                  <p className="text-gray-500">
                    You haven't sent any hire requests. Search for candidates and click the "Hire" button to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-yellow-600" size={20} />
                        <span className="text-xs text-gray-600 font-semibold">Pending</span>
                      </div>
                      <p className="text-2xl font-black text-yellow-700">
                        {hireRequests.filter(r => r.status === 'pending').length}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-xs text-gray-600 font-semibold">Accepted</span>
                      </div>
                      <p className="text-2xl font-black text-green-700">
                        {hireRequests.filter(r => r.status === 'accepted').length}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="text-red-600" size={20} />
                        <span className="text-xs text-gray-600 font-semibold">Rejected</span>
                      </div>
                      <p className="text-2xl font-black text-red-700">
                        {hireRequests.filter(r => r.status === 'rejected').length}
                      </p>
                    </div>
                  </div>

                  {/* Requests List */}
                  <div className="space-y-3">
                    {hireRequests.map((request, index) => (
                      <div
                        key={request.request_id || index}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Users className="text-blue-600" size={24} />
                                <h4 className="text-lg font-black text-black">
                                  {request.employee_name || 'Unknown Candidate'}
                                </h4>
                                <div className={`px-3 py-1 rounded-full border-2 flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                  {getStatusIcon(request.status)}
                                  <span className="text-xs font-black uppercase">{request.status}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Briefcase size={14} />
                                  <span>{request.employee_field || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{request.employee_location || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Request Details */}
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 font-semibold mb-1">Request Sent</p>
                              <p className="text-sm font-black text-black">{formatDate(request.request_date)}</p>
                            </div>
                            {request.response_date && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-600 font-semibold mb-1">Response Date</p>
                                <p className="text-sm font-black text-black">{formatDate(request.response_date)}</p>
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          {request.message && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-xs text-gray-600 font-semibold mb-2">Your Message</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeRequestsModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Agency Section */}
      <section id="about" className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-balance">
                Why Partner <br />
                With AGN <br />
                job bank<span className="text-yellow-400">?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                With over a decade of experience in financial recruitment, AGN job bank has built a reputation for
                delivering exceptional talent. We understand the finance industry inside and out, and we're committed to
                finding candidates who not only have the right skills but also fit your company culture.
              </p>
              <button className="bg-yellow-400 text-black hover:bg-yellow-500 font-black text-base px-8 py-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group">
                Learn More <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Briefcase className="text-yellow-400 opacity-20 group-hover:opacity-30 transition-opacity" size={120} />
            </div>
          </div>
        </div>
      </section>

      {/* About Clients Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Our Clients Trust Us</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            From startups to Fortune 500 companies, we partner with businesses of all sizes
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Diverse Industries",
                description:
                  "We work with clients across banking, accounting, insurance, and corporate finance sectors",
                icon: Award,
              },
              {
                title: "Proven Track Record",
                description: "98% client satisfaction rate with over 500 successful placements in the last decade",
                icon: TrendingUp,
              },
              {
                title: "Dedicated Support",
                description:
                  "Your dedicated recruitment consultant provides ongoing support throughout the hiring process",
                icon: Users,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg hover:bg-yellow-50 transition-all duration-300 border border-gray-200 hover:border-yellow-400 transform hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-black mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Jobs Section */}
      <section id="jobs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">The Talent We Place</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            We specialize in recruiting across all levels of finance professionals
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "Entry Level & Graduates",
                description:
                  "Fresh talent with strong academic backgrounds and eagerness to develop their finance careers",
                icon: Users,
              },
              {
                title: "Part Qualified Professionals",
                description: "Candidates studying ACA, ACCA, CIMA with practical experience and supervisory skills",
                icon: Award,
              },
              {
                title: "Qualified Accountants",
                description: "Newly qualified and post-qualified professionals ready for senior management roles",
                icon: Briefcase,
              },
              {
                title: "Executive & Management",
                description: "Senior finance leaders, CFOs, and directors with extensive industry experience",
                icon: TrendingUp,
              },
            ].map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
                  <job.icon size={40} />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">{job.title}</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>

          {/* Job Types */}
          <div className="bg-white rounded-xl p-8 border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-black text-black mb-6">Employment Types We Offer</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { type: "Permanent Placement", desc: "Full-time, long-term positions" },
                { type: "Fixed Term Contract", desc: "Project-based or temporary roles" },
                { type: "Interim Appointments", desc: "Immediate cover for urgent needs" },
              ].map((emp, idx) => (
                <div key={idx} className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                  <CheckCircle
                    className="text-yellow-400 font-black flex-shrink-0 mt-1 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <div>
                    <p className="font-black text-black">{emp.type}</p>
                    <p className="text-gray-600 text-sm">{emp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 text-balance text-center">
            Why Employers Choose AGN job bank
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Rigorous Vetting Process",
                description:
                  "Every candidate is thoroughly screened for technical skills, cultural fit, and professional integrity",
                icon: Shield,
              },
              {
                title: "Industry Expertise",
                description: "Our team understands finance sector requirements and can identify top talent quickly",
                icon: Award,
              },
              {
                title: "Flexible Solutions",
                description:
                  "Whether you need permanent staff, contractors, or interim cover, we have the right solution",
                icon: Zap,
              },
              {
                title: "Ongoing Support",
                description: "We don't just place candidates - we provide ongoing support to ensure long-term success",
                icon: Users,
              },
              {
                title: "Fast Turnaround",
                description: "Our extensive network means we can often fill positions within days, not weeks",
                icon: TrendingUp,
              },
              {
                title: "Replacement Guarantee",
                description: "If a placement doesn't work out, we'll find a replacement at no additional cost",
                icon: CheckCircle,
              },
            ].map((reason, idx) => (
              <div
                key={idx}
                className="flex gap-4 group hover:translate-x-2 transition-transform animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <reason.icon className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{reason.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8 text-balance">
            Ready to hire top finance talent?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group">
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 bg-transparent rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group">
              Contact Us <Phone className="group-hover:scale-110 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="text-black" size={24} />
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
                  <a href="/" className="text-gray-400 hover:text-yellow-400 transition-colors font-medium">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-yellow-400 transition-colors font-medium">
                    About
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="text-gray-400 hover:text-yellow-400 transition-colors font-medium">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-yellow-400 transition-colors font-medium">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                  <Phone size={18} className="text-yellow-400 flex-shrink-0" />
                  <a href="tel:01216511235">+92 3037774400</a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                  <Mail size={18} className="text-yellow-400 flex-shrink-0" />
                  <a href="mailto:agnjobbank123@gmail.com">agnjobbank123@gmail.com</a>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <MapPin size={18} className="text-yellow-400 flex-shrink-0 mt-1" />
                  <span>Office #6, 2nd Floor, Sitara Plaza, Near Mediacom, Kohinoor Chowk, Faisalabad</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-110"
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
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium">
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
