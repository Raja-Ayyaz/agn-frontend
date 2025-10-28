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
} from "lucide-react"
import { useState } from "react"
import NavBar from "../shared/NavBar"

export default function EmployerDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [experience, setExperience] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    // Simulate search results
    setSearchResults({
      jobTitle,
      experience,
      count: Math.floor(Math.random() * 15) + 5,
      timestamp: new Date().toLocaleTimeString(),
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
    }, 2000)
  }

  const clearResults = () => {
    setSearchResults(null)
    setJobTitle("")
    setExperience("")
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
              onClick={() => document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-black px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
            >
              Search Now
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

            <div className="hidden md:flex justify-end animate-slide-in-right">
              <div className="bg-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Phone size={28} className="text-yellow-500 font-bold" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Call us</p>
                  <p className="font-black text-black text-lg">+92 3037774400</p>
                </div>
              </div>
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
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Accountant, Finance Manager"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition-all duration-200 font-medium hover:border-yellow-400"
                    />
                  </div>

                  <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <label className="block font-black text-black mb-3 text-sm">Experience Level Required</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition-all duration-200 font-medium hover:border-yellow-400"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level / Graduate</option>
                      <option value="part-qualified">Part Qualified</option>
                      <option value="qualified">Qualified Professional</option>
                      <option value="senior">Senior / Management</option>
                      <option value="executive">Executive / Director</option>
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
                {[...Array(Math.min(searchResults.count, 3))].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-all duration-200 transform hover:scale-102 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-blue-500" size={18} />
                          <h4 className="font-black text-black">Candidate {i + 1}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Qualified professional with relevant experience</p>
                        <div className="flex gap-2">
                          <span className="bg-blue-200 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                            Available
                          </span>
                          <span className="bg-green-200 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="text-blue-500 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                View All {searchResults.count} Candidates
              </button>
            </div>
          </div>
        </section>
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
