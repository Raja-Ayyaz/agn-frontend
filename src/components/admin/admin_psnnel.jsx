"use client"

import { useState } from "react"
import { Menu, X, Phone, Mail, MapPin, Linkedin, Twitter, Download, Search, Upload, Trash2 } from "lucide-react"

export default function AdminPanel() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    mobile_no: "",
    role: "",
    experience: "",
    name: "",
    email: "",
    location: "",
  })

  const [results, setResults] = useState([])
  const [jsonInput, setJsonInput] = useState("")
  const [message, setMessage] = useState("No API configured — paste sample JSON or load the built-in sample results.")

  function updateFilter(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }))
  }

  function onSearch(e) {
    e && e.preventDefault()
    setMessage('Search is UI-only. Paste JSON results into the textarea below or click "Load sample results".')
    setResults([])
  }

  function loadSample() {
    const sample = [
      {
        employee_id: 1,
        name: "Alice Doe",
        email: "alice@example.com",
        mobile_no: "+123456789",
        field: "Software Engineer",
        experience: "3 years",
        masked_cv: "masked_1.pdf",
      },
      {
        employee_id: 2,
        name: "Bob Singh",
        email: "bob@example.com",
        mobile_no: "+198765432",
        field: "Product Manager",
        experience: "5 years",
        masked_cv: "masked_2.pdf",
      },
      {
        employee_id: 3,
        name: "Carol White",
        email: "carol@example.com",
        mobile_no: "+145678901",
        field: "Finance Manager",
        experience: "7 years",
        masked_cv: "masked_3.pdf",
      },
    ]
    setResults(sample)
    setMessage(`Loaded ${sample.length} sample rows.`)
  }

  function loadFromJson() {
    if (!jsonInput || !jsonInput.trim()) {
      setMessage("Paste a JSON array of objects in the textarea first.")
      return
    }
    try {
      const parsed = JSON.parse(jsonInput)
      if (!Array.isArray(parsed)) {
        setMessage("The pasted JSON must be an array of objects (e.g. [{...}, {...}]).")
        return
      }
      setResults(parsed)
      setMessage(`Loaded ${parsed.length} rows from pasted JSON.`)
    } catch (err) {
      setMessage("Invalid JSON: " + err.message)
    }
  }

  function downloadCsv() {
    if (!results || results.length === 0) {
      setMessage("No results to export.")
      return
    }
    const cols = Object.keys(results[0])
    const rows = results.map((r) => cols.map((c) => (r[c] == null ? "" : String(r[c]))))
    const csv = [cols.join(","), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))].join(
      "\n",
    )
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `employees_export_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setMessage(`Exported ${results.length} rows to CSV.`)
  }

  const cols = results && results.length > 0 ? Object.keys(results[0]) : []

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">MA</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">ADMIN PANEL</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-black font-bold hover:opacity-70 transition text-sm">
              HOME
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              CANDIDATES
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              REPORTS
            </a>
            <a href="#" className="text-black font-bold hover:opacity-70 transition text-sm">
              SETTINGS
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
                CANDIDATES
              </a>
              <a href="#" className="block text-black font-bold hover:opacity-70 transition">
                REPORTS
              </a>
              <a href="#" className="block text-black font-bold hover:opacity-70 transition">
                SETTINGS
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4 text-balance">
            Candidate Management System
          </h1>
          <p className="text-lg text-black mb-8 max-w-2xl leading-relaxed font-medium">
            Search, filter, and manage candidates with advanced tools. Export data and track recruitment progress.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="mb-12 animate-fade-in-delay">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-yellow-400 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Search size={20} className="text-black font-bold" />
                </div>
                <h2 className="text-2xl font-black text-black">Search & Filter Candidates</h2>
              </div>

              <form onSubmit={onSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Phone Number</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="Enter phone number"
                      value={filters.mobile_no}
                      onChange={(e) => updateFilter("mobile_no", e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Role / Field</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="e.g. Software Engineer"
                      value={filters.role}
                      onChange={(e) => updateFilter("role", e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Experience</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="e.g. 5 years"
                      value={filters.experience}
                      onChange={(e) => updateFilter("experience", e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Name</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="Candidate name"
                      value={filters.name}
                      onChange={(e) => updateFilter("name", e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Email</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="Email address"
                      value={filters.email}
                      onChange={(e) => updateFilter("email", e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-black mb-2">Location</label>
                    <input
                      className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                      placeholder="City or region"
                      value={filters.location}
                      onChange={(e) => updateFilter("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-black text-yellow-400 px-6 py-3 rounded-lg font-black hover:bg-gray-900 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Search size={18} /> Run Search
                  </button>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-black hover:bg-yellow-500 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Upload size={18} /> Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={downloadCsv}
                    className="ml-auto bg-green-600 text-white px-6 py-3 rounded-lg font-black hover:bg-green-700 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Download size={18} /> Export CSV
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* JSON Input Section */}
          <div className="mb-12 animate-fade-in-delay-2">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-yellow-400 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Upload size={20} className="text-black font-bold" />
                </div>
                <h2 className="text-2xl font-black text-white">Import Data</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-yellow-400 mb-2">Paste JSON Array</label>
                  <textarea
                    className="w-full border-2 border-gray-600 p-4 rounded-lg h-32 bg-slate-700 text-white font-mono text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                    placeholder='[{"name":"John","email":"john@example.com"}]'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={loadFromJson}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-black hover:bg-yellow-500 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Upload size={18} /> Load JSON
                  </button>
                  <button
                    onClick={() => {
                      setJsonInput("")
                      setMessage("Cleared pasted JSON")
                    }}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-black hover:bg-red-700 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900">
                <span className="font-black">Status:</span> {message}
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                <h3 className="text-2xl font-black text-white">Results ({results.length})</h3>
              </div>

              {results.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 font-semibold">No results to display.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Use "Load sample results" or paste JSON and click "Load JSON".
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-yellow-400 border-b-2 border-gray-300">
                      <tr>
                        {cols.map((c) => (
                          <th key={c} className="px-6 py-4 font-black text-black">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr
                          key={i}
                          className={`border-b transition hover:bg-yellow-50 ${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          {cols.map((c) => (
                            <td key={c} className="px-6 py-4 text-gray-700 font-medium">
                              {String(row[c] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                    Candidates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Settings
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
