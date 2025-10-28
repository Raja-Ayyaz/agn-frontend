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
  Clipboard,
  Search,
  Briefcase,
  BarChart2,
  TrendingUp,
  Target,
  Clock,
  UserCheck,
  User,
  UserPlus,
  HomeIcon,
  LogIn,
  FilePlus,
} from "lucide-react"
import { useState, useEffect } from "react"
import NavBar from "../shared/NavBar"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".js-h2"))
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const idx = els.indexOf(el)
            const baseDelay = el.classList.contains("delay") ? 120 : 0
            setTimeout(
              () => {
                if (el.classList.contains("js-h2-slow")) {
                  el.classList.add("h2-animate-slow")
                } else {
                  el.classList.add("h2-animate")
                }
                observer.unobserve(el)
              },
              idx * 90 + baseDelay,
            )
          }
        })
      },
      { threshold: 0.2 },
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const openApply = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    window.location.href = "/apply"
    try {
      window.scrollTo(0, 0)
    } catch (err) {}
  }

  const openHire = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    window.location.href = "/hire"
    try {
      window.scrollTo(0, 0)
    } catch (err) {}
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Enhanced logo animation with smooth floating and rotation */
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .logo-animated {
          animation: logoFloat 3.5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        /* Smooth H2 entrance with spring easing */
        @keyframes h2In {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .js-h2 { opacity: 0; transform: translateY(20px); }
        .h2-animate { animation: h2In 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .h2-animate.delay { animation-delay: 0.2s; }
        .h2-animate-slow { animation: h2In 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        /* Accent line with smooth scale animation */
        .h2-accent {
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #f59e0b, #fb923c);
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .h2-accent,
        .group:focus-within .h2-accent {
          transform: scaleX(1);
        }

        /* Card slide-up animation with stagger */
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-animate {
          animation: cardSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Enhanced button with smooth overlay and lift effect */
        @keyframes buttonOverlay {
          from { left: -100%; }
          to { left: 100%; }
        }
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          animation: buttonOverlay 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 0;
        }
        .btn-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
        }
        .btn-primary:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* CTA card with glow effect on hover */
        .cta-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .cta-card:hover::before {
          opacity: 1;
        }
        .cta-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
          border-color: #f59e0b;
        }

        /* Icon bounce animation */
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .icon-bounce {
          animation: iconBounce 2.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        /* Stagger delays for grid items */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        /* Glow effect on hover */
        .glow-hover {
          transition: all 0.3s ease;
        }
        .glow-hover:hover {
          box-shadow: 0 0 24px rgba(245, 158, 11, 0.35);
        }

        /* Stat counter animation */
        @keyframes statGrow {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .stat-item {
          animation: statGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Smooth pulse for decorative elements */
        @keyframes softPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .soft-pulse {
          animation: softPulse 4s ease-in-out infinite;
        }

        /* Enhanced hero image styling */
        .image-enhanced { position: relative; overflow: hidden; border-radius: 1rem; }
        .hero-image {
          display: block;
          width: 100%;
          height: 100%;
          min-width: 100%;
          min-height: 100%;
          object-position: center center;
          transform: scale(1.02);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease;
          will-change: transform;
          filter: brightness(0.82) contrast(1.03) saturate(1.02);
        }
        .image-enhanced:hover .hero-image { transform: scale(1.06); filter: brightness(0.95) contrast(1.04); }
        .image-vignette {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          /* subtler vignette focused on center, avoid darkening corners */
          background: radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.12) 100%);
          mix-blend-mode: normal;
          opacity: 0.85;
        }
        /* Replace bright yellow glow with a darker shadow for the homepage image */
        .image-enhanced.glow-hover:hover {
          box-shadow: 0 24px 48px rgba(0,0,0,0.45) !important;
        }
      `}</style>

      {/* Shared Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl soft-pulse"></div>
        <div
          className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl soft-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -left-32 top-40 w-80 h-80 bg-yellow-200 rounded-full opacity-40 blur-3xl soft-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-black leading-tight mb-6 text-balance animate-in fade-in slide-in-from-left-8 duration-700">
                Where talent meets{" "}
                <span className="relative inline-block">
                  opportunity
                  <span
                    className="absolute -bottom-3 left-0 w-10 h-10 bg-black rounded-full animate-in zoom-in duration-700"
                    style={{ animationDelay: "0.3s" }}
                  ></span>
                </span>
              </h1>
              <p
                className="text-lg text-black mb-8 max-w-md leading-relaxed font-medium animate-in fade-in slide-in-from-left-8 duration-700"
                style={{ animationDelay: "0.2s" }}
              >
                Specialists in financial recruitment, connecting businesses with exceptional people
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="/apply"
                  onClick={openApply}
                  className="cta-card bg-white rounded-2xl p-6 shadow-md border border-transparent cursor-pointer block card-animate stagger-1"
                >
                  <h3 className="text-xl font-black text-black mb-2">I want to apply</h3>
                  <p className="text-gray-600 mb-4 text-sm">Find your next finance role</p>
                  <div className="flex items-center justify-between">
                    <ArrowRight className="text-black font-bold transition-transform duration-300" size={24} />
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center icon-bounce">
                      <Clipboard size={22} className="text-black" />
                    </div>
                  </div>
                </a>

                <a
                  href="/hire"
                  onClick={openHire}
                  className="cta-card bg-white rounded-2xl p-6 shadow-md border border-transparent cursor-pointer block card-animate stagger-2"
                >
                  <h3 className="text-xl font-black text-black mb-2">I want to hire</h3>
                  <p className="text-gray-600 mb-4 text-sm">Find your perfect candidate</p>
                  <div className="flex items-center justify-between">
                    <ArrowRight className="text-black font-bold transition-transform duration-300" size={24} />
                    <div
                      className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center icon-bounce"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Search size={22} className="text-black" />
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phone number callout */}
            <div className="hidden md:flex justify-end">
              <div className="glow-hover bg-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 animate-in fade-in slide-in-from-right-8 duration-700">
                <Phone size={28} className="text-black font-bold icon-bounce" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Call us</p>
                  <p className="font-black text-black text-lg">+92 3037774400</p>
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
              <div className="group inline-block mb-6">
                <h2 className="js-h2 text-5xl md:text-6xl font-black leading-tight text-balance">
                  Experts in <br />
                  Financial <br />
                  Recruitment<span className="text-yellow-400">.</span>
                </h2>
                <span className="h2-accent mt-4 block"></span>
              </div>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                AGN job bank are experts in Financial Recruitment offering honest, transparent advice, helping
                candidates into their next role and clients find valued finance professionals. Operating for over a
                decade in this market, we know our industry inside and out.
              </p>
              <button className="btn-primary bg-yellow-400 text-black font-black text-base px-8 py-4 rounded-lg shadow-md inline-flex items-center gap-2 relative z-10">
                Find out More <ArrowRight className="ml-2 transition-transform duration-300" size={20} />
              </button>
            </div>
            <div className="image-enhanced bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl h-96 flex items-center justify-center overflow-hidden relative glow-hover">
              <img
                src={encodeURI("/images/homepage image.jpg")}
                alt="Homepage"
                className="hero-image object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="image-vignette" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Levels Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="group inline-block mb-4">
            <h2 className="js-h2 js-h2-slow delay text-4xl md:text-5xl font-black text-black text-balance">
              Recruiting Across All <br />
              Career Levels.
            </h2>
            <span className="h2-accent mt-4 block w-40"></span>
          </div>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            For permanent, Fixed Term Contract and Interim Appointments
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transactional Finance",
                description: "Entry level, graduate, experienced professional",
                Icon: BarChart2,
              },
              {
                title: "Part Qualified Finance",
                description: "Studying ACA, ACCA, CIMA, Supervisory/Management or qualified by experience",
                Icon: TrendingUp,
              },
              {
                title: "Qualified Finance",
                description:
                  "Newly qualified/post-qualified ACA, ACCA, CIMA, Senior Management or qualified by experience",
                Icon: Target,
              },
            ].map((level, idx) => (
              <div
                key={idx}
                className={`card-animate bg-gray-50 rounded-xl p-8 hover:shadow-lg hover:bg-yellow-50 transition border border-gray-200 hover:border-yellow-400 cursor-pointer stagger-${idx + 1}`}
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full mb-4 flex items-center justify-center font-black text-black text-xl shadow-md hover:shadow-lg transition duration-300">
                  <level.Icon size={28} className="text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-3">{level.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{level.description}</p>
                <a
                  href="#"
                  className="text-black font-black flex items-center gap-2 hover:gap-3 transition group duration-300"
                >
                  Search <ArrowRight size={20} className="group-hover:translate-x-1 transition duration-300" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="group inline-block mb-4">
            <h2 className="js-h2 text-4xl md:text-5xl font-black text-black text-balance">Our Services.</h2>
            <span className="h2-accent mt-4 block w-36"></span>
          </div>
          <p className="text-gray-600 mb-12 text-lg font-medium">
            Comprehensive recruitment solutions tailored to your needs
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Permanent Placement",
                description: "Find the right talent for long-term roles with comprehensive vetting and support",
                Icon: Briefcase,
              },
              {
                title: "Contract & Interim",
                description: "Flexible staffing solutions for temporary and project-based finance positions",
                Icon: Clock,
              },
              {
                title: "Executive Search",
                description: "Senior-level recruitment for management and director positions",
                Icon: UserCheck,
              },
              {
                title: "Candidate Support",
                description: "Career guidance, interview preparation, and ongoing professional development",
                Icon: User,
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className={`card-animate bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition cursor-pointer stagger-${idx + 1}`}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-yellow-50 rounded-full shadow-md hover:shadow-lg transition duration-300">
                  <service.Icon size={28} className="text-black" />
                </div>
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
          <div className="group inline-block mb-12">
            <h2 className="js-h2 js-h2-slow text-4xl md:text-5xl font-black text-black text-balance">
              A Few Words On Us.
            </h2>
            <span className="h2-accent mt-4 block w-48"></span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "My second time working with AGN job bank and I would highly recommend them. Working with AGN job bank was great, they were reliable and very professional.",
                author: "Candidate – Contractor",
                rating: 5,
              },
              {
                text: "Mitchell provided me with a brilliant, first class service helping me to gain my first graduate role. He and his team worked with great efficiency and reliability.",
                author: "Candidate – Graduate",
                rating: 5,
              },
              {
                text: "I would highly recommend AGN job bank recruitment. They are very professional and very approachable. They gave me every detail I needed in the recruitment stages.",
                author: "Candidate – Management Accountant",
                rating: 5,
              },
              {
                text: "Can I say how pleased we have been with the service during our recent recruitment. They have been really hands-on and offered us excellent quality candidates.",
                author: "Director - Contractor Firm",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="card-animate bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:border-yellow-400 transition cursor-pointer"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="text-yellow-400 text-xl animate-in zoom-in"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
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
              <div key={idx} className={`stat-item stagger-${idx + 1}`}>
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
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8 text-balance animate-in fade-in duration-700">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openApply}
              className="btn-primary bg-black text-yellow-400 font-black text-lg px-8 py-6 rounded-lg shadow-md relative z-10 inline-flex items-center gap-2"
            >
              Apply Now <ArrowRight size={20} />
            </button>
            <button className="btn-primary border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 rounded-lg bg-transparent relative z-10 inline-flex items-center gap-2">
              Hire Talent <ArrowRight size={20} />
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
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
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
                  <a href="#apply" className="text-gray-400 hover:text-yellow-400 transition font-medium duration-300">
                    Apply
                  </a>
                </li>
                <li>
                  <a href="#hire" className="text-gray-400 hover:text-yellow-400 transition font-medium duration-300">
                    Hire
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-yellow-400 transition font-medium duration-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium duration-300">
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
                  <a href="tel:01216511235" className="hover:text-yellow-400 transition duration-300">
                    +92 3037774400
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail size={18} className="text-yellow-400" />
                    <a href="mailto:agnjobbank123@gmail.com" className="hover:text-yellow-400 transition duration-300">
                      agnjobbank123@gmail.com
                    </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} className="text-yellow-400" />
                    <span>Office #6, 2nd Floor, Sitara Plaza, Near Mediacom, Kohinoor Chowk, Faisalabad</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-black text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition transform hover:scale-110 duration-300"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition transform hover:scale-110 duration-300"
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
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-sm font-medium duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-sm font-medium duration-300">
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
