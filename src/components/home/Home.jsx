"use client"

import { ArrowRight, Menu, X, Phone, Mail, MapPin, Linkedin, Twitter } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const openApply = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    navigate('/apply')
    // ensure page is at top when route changes
    try {
      window.scrollTo(0, 0)
    } catch (err) {}
  }

  const openHire = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    navigate('/login')
    try {
      window.scrollTo(0, 0)
    } catch (err) {}
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">AGN</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">MITCHELL ADAM</span>
            <span className="hidden sm:inline font-black text-black text-sm">AGN job bank</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/apply" onClick={openApply} className="text-black font-bold hover:opacity-70 transition text-sm">
              APPLY
            </a>
            <a href="/hire" onClick={openHire} className="text-black font-bold hover:opacity-70 transition text-sm">
              HIRE
            </a>
            <a href="/login" className="text-black font-bold hover:opacity-70 transition text-sm">
              LOGIN
            </a>
            <a href="#about" className="text-black font-bold hover:opacity-70 transition text-sm">
              ABOUT
            </a>
            <a href="#contact" className="text-black font-bold hover:opacity-70 transition text-sm">
              CONTACT
            </a>
          </div>
          <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-yellow-400 border-t-2 border-black">
            <div className="px-4 py-4 space-y-3">
                <a href="/apply" onClick={openApply} className="block text-black font-bold hover:opacity-70 transition">
                  APPLY
                </a>
                <a href="/hire" onClick={openHire} className="block text-black font-bold hover:opacity-70 transition">
                  HIRE
                </a>
                <a href="/login" className="block text-black font-bold hover:opacity-70 transition">
                  LOGIN
                </a>
                <a href="#about" className="block text-black font-bold hover:opacity-70 transition">
                  ABOUT
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
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-black leading-tight mb-6 text-balance">
                Where talent meets{" "}
                <span className="relative inline-block">
                  opportunity
                  <span className="absolute -bottom-3 left-0 w-10 h-10 bg-black rounded-full"></span>
                </span>
              </h1>
              <p className="text-lg text-black mb-8 max-w-md leading-relaxed font-medium">
                Specialists in financial recruitment, connecting businesses with exceptional people
              </p>

              {/* CTA Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="/apply"
                  onClick={openApply}
                  className="bg-white rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer block"
                >
                  <h3 className="text-xl font-black text-black mb-2">I want to apply</h3>
                  <p className="text-gray-600 mb-4 text-sm">Find your next finance role</p>
                  <div className="flex items-center justify-between">
                    <ArrowRight className="text-black font-bold" size={24} />
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </a>

                <a
                  href="/hire"
                  onClick={openHire}
                  className="bg-white rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer block"
                >
                  <h3 className="text-xl font-black text-black mb-2">I want to hire</h3>
                  <p className="text-gray-600 mb-4 text-sm">Find your perfect candidate</p>
                  <div className="flex items-center justify-between">
                    <ArrowRight className="text-black font-bold" size={24} />
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phone number callout */}
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

      {/* Expertise Section */}
      <section id="about" className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-balance">
                Experts in <br />
                Financial <br />
                Recruitment<span className="text-yellow-400">.</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                AGN job bank are experts in Financial Recruitment offering honest, transparent advice, helping
                candidates into their next role and clients find valued finance professionals. Operating for over a
                decade in this market, we know our industry inside and out.
              </p>
              <button className="bg-yellow-400 text-black hover:bg-yellow-500 font-black text-base px-8 py-6">
                Find out More <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="text-8xl relative z-10">👨‍💼</span>
            </div>
          </div>
        </div>
      </section>

      {/* Career Levels Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">
            Recruiting Across All <br />
            Career Levels.
          </h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            For permanent, Fixed Term Contract and Interim Appointments
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transactional Finance",
                description: "Entry level, graduate, experienced professional",
                icon: "📊",
              },
              {
                title: "Part Qualified Finance",
                description: "Studying ACA, ACCA, CIMA, Supervisory/Management or qualified by experience",
                icon: "📈",
              },
              {
                title: "Qualified Finance",
                description:
                  "Newly qualified/post-qualified ACA, ACCA, CIMA, Senior Management or qualified by experience",
                icon: "🎯",
              },
            ].map((level, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg hover:bg-yellow-50 transition border border-gray-200"
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl">
                  {level.icon}
                </div>
                <h3 className="text-xl font-black text-black mb-3">{level.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{level.description}</p>
                <a href="#" className="text-black font-black flex items-center gap-2 hover:gap-3 transition group">
                  Search <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 text-balance">Our Services.</h2>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            Comprehensive recruitment solutions tailored to your needs
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Permanent Placement",
                description: "Find the right talent for long-term roles with comprehensive vetting and support",
                icon: "💼",
              },
              {
                title: "Contract & Interim",
                description: "Flexible staffing solutions for temporary and project-based finance positions",
                icon: "⏱️",
              },
              {
                title: "Executive Search",
                description: "Senior-level recruitment for management and director positions",
                icon: "👔",
              },
              {
                title: "Candidate Support",
                description: "Career guidance, interview preparation, and ongoing professional development",
                icon: "🤝",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-black text-black mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-balance">A Few Words On Us.</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "My second time working with Mitchell Adam and I would highly recommend them. Working with Mitchell Adam was great, they were reliable and very professional.",
                author: "Candidate – Contractor",
                rating: 5,
              },
              {
                text: "Mitchell provided me with a brilliant, first class service helping me to gain my first graduate role. He and his team worked with great efficiency and reliability.",
                author: "Candidate – Graduate",
                rating: 5,
              },
              {
                text: "I would highly recommend Mitchell Adam recruitment. They are very professional and very approachable. They gave me every detail I needed in the recruitment stages.",
                author: "Candidate – Management Accountant",
                rating: 5,
              },
              {
                text: "Can I say how pleased we have been with the service during our recent recruitment. They have been really hands-on and offered us excellent quality candidates.",
                author: "Director - Contractor Firm",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <p className="text-sm font-black text-black">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Years Experience" },
              { number: "500+", label: "Placements" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl md:text-6xl font-black text-yellow-400 mb-2">{stat.number}</div>
                <p className="text-gray-300 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-yellow-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8 text-balance">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openApply} className="bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6">
              Apply Now <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 bg-transparent">
              Hire Talent <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-black text-lg">MA</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Mitchell Adam</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Specialists in financial recruitment, connecting talent with opportunity.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#apply" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Apply
                  </a>
                </li>
                <li>
                  <a href="#hire" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Hire
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Services
                  </a>
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
                  <a href="mailto:info@mitchelladam.co.uk" className="hover:text-yellow-400 transition">
                    info@mitchelladam.co.uk
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
