import { useState, useEffect } from "react"
import { Download, Search, Upload, Trash2 } from "lucide-react"
import { deleteEmployee } from "../../../Api/Service/apiService"
import CONFIG from "../../../Api/Config/config"

export default function ManageEmployees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allEmployees, setAllEmployees] = useState([])
  const [toasts, setToasts] = useState([])
  
  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }

  // Fetch employees automatically when component loads
  useEffect(() => {
    fetchEmployeesFromApi()
  }, [])

  // Filter employees based on search query
  const filteredResults = allEmployees.filter((emp) => {
    if (!searchQuery.trim()) return true
    
    // Split search query by spaces to get multiple search terms
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)
    
    const name = (emp.name || "").toLowerCase()
    const mobile = (emp.mobile_no || "").toLowerCase()
    const route = (emp.nearest_route || "").toLowerCase()
    const field = (emp.field || "").toLowerCase()
    const location = (emp.location || "").toLowerCase()
    
    // Combine all searchable fields into one string
    const allFields = `${name} ${mobile} ${route} ${field} ${location}`
    
    // Check if ALL search terms are found in any of the fields
    return searchTerms.every(term => allFields.includes(term))
  })

  function onSearch(e) {
    e && e.preventDefault()
    // Search is now handled by filteredResults in real-time
    if (allEmployees.length === 0) {
      showToast("info", "Loading employees...")
    } else if (filteredResults.length === 0) {
      showToast("info", `No employees found matching "${searchQuery}"`)
    } else {
      showToast("success", `Found ${filteredResults.length} employee(s)`)
    }
  }

  async function fetchEmployeesFromApi() {
    try {
      const params = new URLSearchParams({ limit: 200 })
      const url = `${CONFIG.BASE_URL}/api/employees?${params.toString()}`
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
      
      const r = await fetch(url, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      const j = await r.json()
      if (j.ok) {
        setAllEmployees(j.rows)
      } else {
        showToast("error", `API error: ${j.error}`)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast("error", "Request timed out. The server is taking too long to respond.")
      } else {
        showToast("error", `Fetch error: ${err.message}`)
      }
    }
  }

  function updateCvForEmployee(empId) {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx"
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return
      const fd = new FormData()
      fd.append("cv", file)
      showToast("info", `Uploading CV for ${empId}...`)
      try {
        const r = await fetch(`${CONFIG.BASE_URL}/api/employee/${empId}/update_cv`, {
          method: "POST",
          body: fd,
        })
        const j = await r.json()
        if (j.ok) {
          showToast("success", `Updated CV for ${empId}`)
          setAllEmployees((prev) => prev.map((row) => (row.employee_id === empId ? { ...row, cv: j.cv_url, masked_cv: j.masked_cv_url } : row)))
        } else {
          showToast("error", `Error: ${j.error}`)
        }
      } catch (err) {
        showToast("error", `Upload error: ${err.message}`)
      }
    }
    input.click()
  }

  async function handleDeleteEmployee(empId, empName) {
    if (!confirm(`Are you sure you want to delete employee "${empName}"? This action cannot be undone.`)) {
      return
    }

    try {
      showToast("info", `Deleting employee ${empName}...`)
      const response = await deleteEmployee(empId)
      
      if (response && response.ok) {
        showToast("success", `Employee ${empName} deleted successfully`)
        // Remove from local state
        setAllEmployees((prev) => prev.filter((emp) => emp.employee_id !== empId))
      } else {
        showToast("error", `Failed to delete: ${response?.error || 'Unknown error'}`)
      }
    } catch (err) {
      showToast("error", `Delete error: ${err.message}`)
    }
  }

  // Define the columns to display in the table
  const columns = [
    { key: "employee_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "email", label: "Email" },
    { key: "mobile_no", label: "Mobile No" },
    { key: "location", label: "Location" },
    { key: "nearest_route", label: "Nearest Route" },
    { key: "cnic_no", label: "CNIC No" },
    { key: "educational_profile", label: "Educational Profile" },
    { key: "recent_completed_education", label: "Recent Education" },
    { key: "field", label: "Field" },
    { key: "experience", label: "Experience" },
    { key: "experience_detail", label: "Experience Detail" },
    { key: "cv", label: "CV" },
    { key: "masked_cv", label: "Masked CV" },
  ]

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Search size={20} className="text-black font-bold" />
            </div>
            <h2 className="text-2xl font-black text-black">Search & Filter Candidates</h2>
          </div>

          <form onSubmit={onSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition bg-white hover:border-yellow-300"
                placeholder="Search by name, email, phone, field, location, route... (use spaces for multiple filters)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-black text-yellow-400 px-6 py-3 rounded-lg font-black hover:bg-gray-900 transition transform hover:scale-105 flex items-center gap-2"
              >
                <Search size={18} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Table */}
      <div className="w-full">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <h3 className="text-2xl font-black text-white">Employees ({filteredResults.length})</h3>
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 font-semibold">
                {allEmployees.length === 0 ? "Loading employees..." : "No employees found matching your search."}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {allEmployees.length === 0 
                  ? "Please wait while we fetch employee data from the database."
                  : "Try a different search term or clear the search to see all employees."}
              </p>
            </div>
          ) : (
            <div 
              className="overflow-x-auto"
              style={{ 
                width: '100%',
                maxWidth: '100%'
              }}
            >
              <table className="text-left text-sm" style={{ width: 'max-content', minWidth: '100%' }}>
                <thead className="bg-yellow-400 border-b-2 border-gray-300">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} className="px-6 py-4 font-black text-black whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 font-black text-black whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((row, i) => (
                    <tr
                      key={row.employee_id || i}
                      className={`border-b transition hover:bg-yellow-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                          {col.key === "cv" || col.key === "masked_cv" ? (
                            row[col.key] ? (
                              <a
                                href={row[col.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )
                          ) : (
                            String(row[col.key] ?? "-")
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateCvForEmployee(row.employee_id)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap flex items-center gap-1.5 text-xs"
                          >
                            <Upload size={14} /> Update CV
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(row.employee_id, row.name)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition whitespace-nowrap flex items-center gap-1.5 text-xs"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
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
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transform transition-all duration-200 ${
              t.type === "success" ? "bg-emerald-600" : t.type === "info" ? "bg-sky-600" : "bg-rose-600"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
