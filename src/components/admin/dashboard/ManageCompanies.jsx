"use client"

import { useState, useEffect } from "react"
import { Search, Trash2 } from "lucide-react"
import { deleteEmployer } from "../../../Api/Service/apiService"
import CONFIG from "../../../Api/Config/config"

export default function ManageCompanies() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allCompanies, setAllCompanies] = useState([])
  const [toasts, setToasts] = useState([])

  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }

  useEffect(() => {
    fetchCompaniesFromApi()
  }, [])

  const filteredResults = allCompanies.filter((company) => {
    if (!searchQuery.trim()) return true

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)

    const username = (company.username || "").toLowerCase()
    const companyName = (company.comapny_name || "").toLowerCase()
    const email = (company.email || "").toLowerCase()
    const phone = (company.phone || "").toLowerCase()

    const allFields = `${username} ${companyName} ${email} ${phone}`

    return searchTerms.every((term) => allFields.includes(term))
  })

  function onSearch(e) {
    e && e.preventDefault()
    if (allCompanies.length === 0) {
      showToast("info", "Loading companies...")
    } else if (filteredResults.length === 0) {
      showToast("info", `No companies found matching "${searchQuery}"`)
    } else {
      showToast("success", `Found ${filteredResults.length} company/companies`)
    }
  }

  async function fetchCompaniesFromApi() {
    try {
      const url = `${CONFIG.BASE_URL}/api/employers`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const r = await fetch(url, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      const j = await r.json()
      if (j.ok) {
        const userCompanies = j.rows.filter((company) => company.role !== "admin")
        setAllCompanies(userCompanies)
      } else {
        showToast("error", `API error: ${j.error}`)
      }
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("error", "Request timed out. The server is taking too long to respond.")
      } else {
        showToast("error", `Fetch error: ${err.message}`)
      }
    }
  }

  async function handleDeleteCompany(employerId, companyName) {
    if (!confirm(`Are you sure you want to delete company "${companyName}"? This action cannot be undone.`)) {
      return
    }

    try {
      showToast("info", `Deleting company ${companyName}...`)
      const response = await deleteEmployer(employerId)

      if (response && response.ok) {
        showToast("success", `Company ${companyName} deleted successfully`)
        setAllCompanies((prev) => prev.filter((company) => company.employer_id !== employerId))
      } else {
        showToast("error", `Failed to delete: ${response?.error || "Unknown error"}`)
      }
    } catch (err) {
      showToast("error", `Delete error: ${err.message}`)
    }
  }

  const columns = [
    { key: "employer_id", label: "ID" },
    { key: "username", label: "Username" },
    { key: "comapny_name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ]

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
              <Search size={20} className="text-black font-bold" />
            </div>
            <h2 className="text-2xl font-black text-black">Search & Filter Companies</h2>
          </div>

          <form onSubmit={onSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                className="flex-1 border-2 border-slate-300 p-3 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition bg-white hover:border-amber-300 font-medium"
                placeholder="Search by username, company name, email, phone... (use spaces for multiple filters)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-black text-amber-400 px-6 py-3 rounded-xl font-black hover:bg-slate-900 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Search size={18} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Table */}
      <div className="w-full">
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
            <h3 className="text-2xl font-black text-white">Companies ({filteredResults.length})</h3>
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-slate-600 font-semibold">
                {allCompanies.length === 0 ? "Loading companies..." : "No companies found matching your search."}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {allCompanies.length === 0
                  ? "Please wait while we fetch company data from the database."
                  : "Try a different search term or clear the search to see all companies."}
              </p>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                overflowY: "visible",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table
                className="text-left text-sm border-collapse"
                style={{ width: "max-content", minWidth: "2000px", tableLayout: "fixed" }}
              >
                <thead className="bg-amber-400 border-b-2 border-amber-300">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-4 font-black text-black whitespace-nowrap"
                        style={{ minWidth: "200px" }}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th
                      className="px-6 py-4 font-black text-black whitespace-nowrap"
                      style={{ minWidth: "250px", width: "250px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((row, i) => (
                    <tr
                      key={row.employer_id || i}
                      className={`border-b-2 transition-all duration-300 hover:bg-amber-50 border-b-slate-200 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 text-slate-700 font-medium"
                          style={{ minWidth: "200px" }}
                        >
                          {String(row[col.key] ?? "-")}
                        </td>
                      ))}
                      <td className="px-6 py-4" style={{ minWidth: "250px", width: "250px" }}>
                        <button
                          onClick={() => handleDeleteCompany(row.employer_id, row.comapny_name || row.username)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast container */}
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transform transition-all duration-300 pointer-events-auto ${
              t.type === "success" ? "bg-emerald-600" : t.type === "info" ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
