"use client"

import { ArrowRight, Menu, X, Phone, Mail, MapPin, Linkedin, Twitter, CheckCircle } from "lucide-react"

import { useState } from "react"

export default function EmployerDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [experience, setExperience] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setJobTitle("")
      setExperience("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">AGN</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">AGN job bank</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-black font-bold hover:opacity-70 transition text-sm">
              HOME
            </a>
            <a href="#about" className="text-black font-bold hover:opacity-70 transition text-sm">
              ABOUT
            </a>
            <a href="#jobs" className="text-black font-bold hover:opacity-70 transition text-sm">
              JOBS
            </a>
            <a href="#contact" className="text-black font-bold hover:opacity-70 transition text-sm">
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
              <a href="#about" className="block text-black font-bold hover:opacity-70 transition">
                ABOUT
              </a>
              <a href="#jobs" className="block text-black font-bold hover:opacity-70 transition">
                JOBS
              </a>
              <a href="#contact" className="block text-black font-bold hover:opacity-70 transition">
                CONTACT
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
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

            <div className="hidden md:flex justify-end">
              <div className="bg-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 hover:shadow-2xl transition">
                <Phone size={28} className="text-black font-bold" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Call us</p>
                  <p className="font-black text-black text-lg">0121 651 1235</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Agency Section */}
      <section id="about" className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
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
              <button className="bg-yellow-400 text-black hover:bg-yellow-500 font-black text-base px-8 py-6 rounded-lg transition">
                Learn More <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="text-8xl relative z-10">🏢</span>
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
                icon: "🏦",
              },
              {
                title: "Proven Track Record",
                description: "98% client satisfaction rate with over 500 successful placements in the last decade",
                icon: "📊",
              },
              {
                title: "Dedicated Support",
                description:
                  "Your dedicated recruitment consultant provides ongoing support throughout the hiring process",
                icon: "🤝",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg hover:bg-yellow-50 transition border border-gray-200"
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl">
                  {item.icon}
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
                icon: "🎓",
              },
              {
                title: "Part Qualified Professionals",
                description: "Candidates studying ACA, ACCA, CIMA with practical experience and supervisory skills",
                icon: "📚",
              },
              {
                title: "Qualified Accountants",
                description: "Newly qualified and post-qualified professionals ready for senior management roles",
                icon: "👨‍💼",
              },
              {
                title: "Executive & Management",
                description: "Senior finance leaders, CFOs, and directors with extensive industry experience",
                icon: "👔",
              },
            ].map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{job.icon}</div>
                <h3 className="text-2xl font-black text-black mb-3">{job.title}</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>

          {/* Job Types */}
          <div className="bg-white rounded-xl p-8 border-2 border-yellow-400">
            <h3 className="text-2xl font-black text-black mb-6">Employment Types We Offer</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { type: "Permanent Placement", desc: "Full-time, long-term positions" },
                { type: "Fixed Term Contract", desc: "Project-based or temporary roles" },
                { type: "Interim Appointments", desc: "Immediate cover for urgent needs" },
              ].map((emp, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-400 font-black flex-shrink-0 mt-1" size={24} />
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

      {/* Employer Dashboard Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance text-center">
            Search Our Talent Pool
          </h2>
          <p className="text-gray-600 mb-12 text-lg font-medium text-center max-w-2xl mx-auto">
            Tell us what you're looking for and we'll help you find the perfect candidate
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-400">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2">Search Submitted!</h3>
                  <p className="text-gray-700">
                    We'll review your requirements and get back to you shortly with matching candidates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSearch}>
                  <div className="mb-6">
                    <label className="block font-black text-black mb-2">Job Title or Role</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Accountant, Finance Manager"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition font-medium"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block font-black text-black mb-2">Experience Level Required</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-black focus:outline-none transition font-medium"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level / Graduate</option>
                      <option value="part-qualified">Part Qualified</option>
                      <option value="qualified">Qualified Professional</option>
                      <option value="senior">Senior / Management</option>
                      <option value="executive">Executive / Director</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-4 rounded-lg transition transform hover:scale-105"
                  >
                    Search Candidates <ArrowRight className="inline ml-2" size={20} />
                  </button>
                </form>
              )}
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
              },
              {
                title: "Industry Expertise",
                description: "Our team understands finance sector requirements and can identify top talent quickly",
              },
              {
                title: "Flexible Solutions",
                description:
                  "Whether you need permanent staff, contractors, or interim cover, we have the right solution",
              },
              {
                title: "Ongoing Support",
                description: "We don't just place candidates - we provide ongoing support to ensure long-term success",
              },
              {
                title: "Fast Turnaround",
                description: "Our extensive network means we can often fill positions within days, not weeks",
              },
              {
                title: "Replacement Guarantee",
                description: "If a placement doesn't work out, we'll find a replacement at no additional cost",
              },
            ].map((reason, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-black" size={24} />
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
            <button className="bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-lg transition">
              Get Started <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 bg-transparent rounded-lg transition">
              Contact Us <Phone className="ml-2" size={20} />
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
                <span className="text-black font-black text-lg">AGN</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Mitchell Adam</h3>
              <h3 className="text-xl font-black text-white mb-2">AGN job bank</h3>
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
                  <a href="#about" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    About
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Contact
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
                    info@agnjobbank.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} className="text-yellow-400" />
                  <span>Birmingham, UK</span>
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 Mitchell Adam Recruitment. All rights reserved.</p>
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
