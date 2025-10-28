"use client"

import { Menu, X, FilePlus, UserPlus, LogIn, HomeIcon, Mail } from "lucide-react"
import { useState } from "react"

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <>
      <style>{`
        /* Nav-specific animations copied from Home for parity */
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .logo-animated {
          animation: logoFloat 3.5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        /* small helper to smooth mobile menu appearance when JS toggles it */
        .nav-mobile-enter {
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .nav-mobile-enter.nav-mobile-enter-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

    <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="logo-animated w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <span className="text-yellow-400 font-black text-lg">AGN</span>
          </div>

          <span className="hidden sm:inline font-black text-black text-sm">AGN job bank</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/apply"
            onClick={openApply}
            className="flex items-center gap-2 text-black font-bold hover:text-gray-700 transition duration-300 hover:gap-3"
          >
            <FilePlus size={16} /> APPLY
          </a>
          <a
            href="/hire"
            onClick={openHire}
            className="flex items-center gap-2 text-black font-bold hover:text-gray-700 transition duration-300 hover:gap-3"
          >
            <UserPlus size={16} /> HIRE
          </a>
          <a
            href="/admin/login"
            className="flex items-center gap-2 text-black font-bold hover:text-gray-700 transition duration-300 hover:gap-3"
          >
            <LogIn size={16} /> LOGIN
          </a>
          <a
            href="#about"
            className="flex items-center gap-2 text-black font-bold hover:text-gray-700 transition duration-300 hover:gap-3"
          >
            <HomeIcon size={16} /> ABOUT
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 text-black font-bold hover:text-gray-700 transition duration-300 hover:gap-3"
          >
            <Mail size={16} /> CONTACT
          </a>
        </div>
        <button
          className="md:hidden text-black p-2 hover:bg-yellow-300 rounded-lg transition duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-yellow-400 border-t-2 border-black animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/apply"
              onClick={openApply}
              className="block text-black font-bold hover:text-gray-700 transition flex items-center gap-2 duration-300"
            >
              <FilePlus size={16} /> APPLY
            </a>
            <a
              href="/hire"
              onClick={openHire}
              className="block text-black font-bold hover:text-gray-700 transition flex items-center gap-2 duration-300"
            >
              <UserPlus size={16} /> HIRE
            </a>
            <a
              href="/login"
              className="block text-black font-bold hover:text-gray-700 transition flex items-center gap-2 duration-300"
            >
              <LogIn size={16} /> LOGIN
            </a>
            <a
              href="#about"
              className="block text-black font-bold hover:text-gray-700 transition flex items-center gap-2 duration-300"
            >
              <HomeIcon size={16} /> ABOUT
            </a>
            <a
              href="#contact"
              className="block text-black font-bold hover:text-gray-700 transition flex items-center gap-2 duration-300"
            >
              <Mail size={16} /> CONTACT
            </a>
          </div>
        </div>
      )}
    </nav>
    </>
  )
}
