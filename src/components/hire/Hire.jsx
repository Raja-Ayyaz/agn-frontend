"use client"

import {
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import "./globals.css"

export default function HirePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    employer_id: "",
    username: "",
    company_name: "",
    email: "",
    password: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sideImage, setSideImage] = useState(null)
  // Static image path served from the public folder (place your image at public/images/hire-side.jpg)
  const STATIC_SIDE_IMAGE = '/images/hire-side.jpg'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSideImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setSideImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      username: formData.username,
      company_name: formData.company_name,
      email: formData.email,
      password: formData.password,
    }

    fetch("http://localhost:8000/insert_employer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success:", data)
        setSubmitted(true)
        setFormData({ employer_id: "", username: "", company_name: "", email: "", password: "" })
        setTimeout(() => setSubmitted(false), 5000)
      })
      .catch((err) => console.error("Error:", err))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">MA</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">MITCHELL ADAM</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-black font-bold hover:opacity-70 transition text-sm">
              HOME
            </a>
            <a href="/apply" className="text-black font-bold hover:opacity-70 transition text-sm">
              APPLY
            </a>
          </div>
          <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-6 text-balance animate-fade-in">
            Hire with Mitchell Adam
          </h1>
          <p className="text-lg text-black mb-8 max-w-2xl leading-relaxed font-medium animate-fade-in-delay">
            Find exceptional finance professionals to drive your business forward. Post roles, review candidates, and
            build your dream team.
          </p>
        </div>
      </section>

      {/* Registration Form Section — two-column: decorative empty side + form on right */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Decorative left side (empty on purpose) */}
          <div className="hidden md:flex items-center justify-center">
            <label className="hire-side w-full h-full rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative">
              {/* show uploaded image if present, otherwise use static image placed in public/images/ */}
              <img
                src={sideImage || STATIC_SIDE_IMAGE}
                alt="side preview"
                className="object-cover w-full h-full"
                onError={(e) => {
                  // if static image isn't present, fall back to a simple placeholder text
                  e.currentTarget.style.display = 'none'
                }}
              />
              {/* fallback label content when no static image exists and no upload done */}
              {!sideImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
                  <p className="font-black text-lg text-black mb-2">Place your image at</p>
                  <p className="text-sm text-gray-600">/public/images/hire-side.jpg</p>
                </div>
              )}
              {/* click to replace/upload (optional) */}
              <input type="file" accept="image/*" onChange={handleSideImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
          </div>

          {/* Form column - on medium+ screens this will appear on the right */}
          <div className="w-full">
            <div className="mx-auto md:ml-auto md:w-11/12 lg:w-3/4">
              <div className="text-center mb-6 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Get Started Today</h2>
                <p className="text-gray-600 text-lg font-medium">Create your employer account and start hiring top finance talent</p>
              </div>

              {submitted && (
                <div className="mb-8 bg-green-50 border-2 border-green-400 rounded-xl p-6 flex items-start gap-4 animate-slide-down">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-black">✓</span>
                  </div>
                  <div>
                    <h3 className="font-black text-green-900 text-lg mb-1">Employer Registered!</h3>
                    <p className="text-green-800">We've saved your employer details. Check your email for next steps.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-delay-2">
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-black text-black mb-6">Employer Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition focus:shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition focus:shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition focus:shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        maxLength={15}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition focus:shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-xl transition transform hover:scale-105 active:scale-95"
                  >
                    Create Employer Account <ArrowRight className="ml-2 inline" size={20} />
                  </button>
                  <a
                    href="/"
                    className="flex-1 border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 rounded-xl bg-white transition text-center"
                  >
                    Back Home
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hire With Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Why Hire With Us?</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            Access a curated network of finance professionals ready to make an impact
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={32} />,
                title: "Vetted Talent Pool",
                description: "All candidates are thoroughly screened and verified for qualifications and experience",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Quick Placements",
                description: "Average time to hire reduced by 60% with our streamlined recruitment process",
              },
              {
                icon: <Briefcase size={32} />,
                title: "Flexible Solutions",
                description: "Permanent, contract, interim, or executive search - we have the right fit for you",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition hover:scale-105"
              >
                <div className="text-yellow-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-black text-black mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Agency Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-balance">
                About Mitchell <br />
                Adam<span className="text-yellow-400">.</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                With over a decade of experience in financial recruitment, Mitchell Adam has built a reputation for
                excellence, integrity, and results. We understand the unique challenges of hiring finance professionals
                and have the expertise to deliver.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "10+ years in finance recruitment",
                  "500+ successful placements",
                  "98% client satisfaction rate",
                  "24/7 dedicated support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="text-8xl relative z-10">🏢</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Our Clients</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            We partner with leading companies across diverse industries
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                industry: "Financial Services",
                description: "Banks, investment firms, and fintech companies seeking top finance talent",
              },
              {
                industry: "Corporate Finance",
                description: "Large enterprises requiring experienced finance professionals and controllers",
              },
              {
                industry: "Accounting Firms",
                description: "Big 4 and mid-tier firms looking for qualified accountants and auditors",
              },
              {
                industry: "Tech & Startups",
                description: "Growing companies needing finance expertise to scale operations",
              },
            ].map((client, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-black text-black mb-3">{client.industry}</h3>
                <p className="text-gray-600 leading-relaxed">{client.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Jobs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Available Job Levels</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            We recruit across all career stages and specializations
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Entry Level & Graduate",
                roles: ["Graduate Accountants", "Junior Finance Analysts", "Finance Administrators"],
                icon: "🎓",
              },
              {
                title: "Mid-Level Professionals",
                roles: ["Senior Accountants", "Finance Managers", "Management Accountants"],
                icon: "📊",
              },
              {
                title: "Senior & Executive",
                roles: ["Finance Directors", "CFOs", "Finance Controllers"],
                icon: "👔",
              },
            ].map((level, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{level.icon}</div>
                <h3 className="text-xl font-black text-black mb-4">{level.title}</h3>
                <ul className="space-y-2">
                  {level.roles.map((role, i) => (
                    <li key={i} className="text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8 text-balance">
            Ready to find your next hire?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button type="button" className="bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-xl transition inline-flex items-center justify-center">
              Post a Job <ArrowRight className="ml-2" size={20} />
            </button>
            <button type="button" className="border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 bg-transparent rounded-xl transition inline-flex items-center justify-center">
              Browse Candidates <ArrowRight className="ml-2" size={20} />
            </button>
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
                  <a href="/apply" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Apply
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Services
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
