import { useState, useEffect } from "react"
import { Users, Briefcase, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Mail, Building2, FileText, X } from "lucide-react"
import { getAllHireRequests, respondToHireRequest } from '../../../Api/Service/apiService'

export default function HireRequests() {
  const [allRequests, setAllRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [responseModal, setResponseModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [responseAction, setResponseAction] = useState(null) // 'accept' or 'reject'
  const [responseMessage, setResponseMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])

  const showToast = (type, text, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }

  useEffect(() => {
    fetchAllRequests()
  }, [])

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRequests(allRequests)
    } else {
      setFilteredRequests(allRequests.filter(req => req.status === filterStatus))
    }
  }, [filterStatus, allRequests])

  const fetchAllRequests = async () => {
    setLoading(true)
    try {
      const response = await getAllHireRequests()
      if (response && response.ok) {
        setAllRequests(response.requests || [])
        setFilteredRequests(response.requests || [])
      } else {
        showToast("error", response?.error || "Failed to load hire requests")
      }
    } catch (error) {
      console.error("Fetch requests error:", error)
      showToast("error", "Failed to load hire requests")
    } finally {
      setLoading(false)
    }
  }

  const openResponseModal = (request, action) => {
    setSelectedRequest(request)
    setResponseAction(action)
    setResponseMessage("")
    setResponseModal(true)
  }

  const closeResponseModal = () => {
    setResponseModal(false)
    setSelectedRequest(null)
    setResponseAction(null)
    setResponseMessage("")
  }

  const handleResponseSubmit = async () => {
    if (!responseMessage.trim()) {
      showToast("error", "Please enter a response message")
      return
    }

    setSubmitting(true)
    try {
      const newStatus = responseAction === 'accept' ? 'accepted' : 'rejected'
      
      const response = await respondToHireRequest({
        request_id: selectedRequest.request_id,
        status: newStatus,
        response_message: responseMessage.trim()
      })

      if (response && response.ok) {
        showToast("success", `Request ${newStatus} successfully!`)
        closeResponseModal()
        fetchAllRequests() // Reload the list
      } else {
        showToast("error", response?.error || "Failed to update request")
      }
    } catch (error) {
      console.error("Response submit error:", error)
      showToast("error", "Failed to submit response")
    } finally {
      setSubmitting(false)
    }
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

  const pendingCount = allRequests.filter(r => r.status === 'pending').length
  const acceptedCount = allRequests.filter(r => r.status === 'accepted').length
  const rejectedCount = allRequests.filter(r => r.status === 'rejected').length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-black mb-2">Hire Requests Management</h2>
            <p className="text-gray-600">Review and respond to employer hire requests</p>
          </div>
          <button
            onClick={fetchAllRequests}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-black px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={24} />
            <span className="text-sm text-gray-600 font-semibold">Total Requests</span>
          </div>
          <p className="text-3xl font-black text-black">{allRequests.length}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => setFilterStatus('pending')}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-yellow-600" size={24} />
            <span className="text-sm text-gray-600 font-semibold">Pending</span>
          </div>
          <p className="text-3xl font-black text-yellow-700">{pendingCount}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => setFilterStatus('accepted')}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <span className="text-sm text-gray-600 font-semibold">Accepted</span>
          </div>
          <p className="text-3xl font-black text-green-700">{acceptedCount}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => setFilterStatus('rejected')}>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-600" size={24} />
            <span className="text-sm text-gray-600 font-semibold">Rejected</span>
          </div>
          <p className="text-3xl font-black text-red-700">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-2 mb-6 border-2 border-gray-200 shadow-sm inline-flex gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            filterStatus === 'all' ? 'bg-black text-yellow-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            filterStatus === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('accepted')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            filterStatus === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h4 className="text-xl font-black text-gray-700 mb-2">No {filterStatus !== 'all' ? filterStatus : ''} Requests Found</h4>
            <p className="text-gray-500">
              {filterStatus === 'all' ? 'No hire requests have been submitted yet.' : `No ${filterStatus} requests to display.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request, index) => (
              <div
                key={request.request_id || index}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded-full border-2 flex items-center gap-2 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-xs font-black uppercase">{request.status}</span>
                      </div>
                      <span className="text-sm text-gray-500 font-semibold">
                        Request #{request.request_id}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Employer Details */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="text-blue-600" size={20} />
                          <h4 className="font-black text-black">Employer Details</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 font-semibold">Company:</span>
                            <p className="text-black font-bold">{request.employer_company || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-semibold">Contact:</span>
                            <p className="text-black font-bold">{request.employer_username || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-semibold">Email:</span>
                            <p className="text-black font-bold">{request.employer_email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Employee Details */}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="text-green-600" size={20} />
                          <h4 className="font-black text-black">Candidate Details</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 font-semibold">Name:</span>
                            <p className="text-black font-bold">{request.employee_name || 'N/A'}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Briefcase size={14} className="text-green-600" />
                              <span className="text-black font-bold">{request.employee_field || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-green-600" />
                              <span className="text-black font-bold">{request.employee_location || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} className="text-gray-600" />
                          <span className="text-xs text-gray-600 font-semibold">Request Sent</span>
                        </div>
                        <p className="text-sm font-black text-black">{formatDate(request.request_date)}</p>
                      </div>
                      {request.response_date && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={16} className="text-gray-600" />
                            <span className="text-xs text-gray-600 font-semibold">Response Date</span>
                          </div>
                          <p className="text-sm font-black text-black">{formatDate(request.response_date)}</p>
                        </div>
                      )}
                    </div>

                    {/* Request Message */}
                    {request.message && (
                      <div className={`mt-4 rounded-lg p-4 border ${
                        request.status === 'pending' 
                          ? 'bg-white border-gray-300'
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Mail size={16} className={request.status === 'pending' ? 'text-gray-600' : 'text-blue-600'} />
                          <span className={`text-xs font-semibold ${
                            request.status === 'pending' ? 'text-gray-600' : 'text-blue-600'
                          }`}>
                            {request.status === 'pending' ? "Employer's Message" : "Admin Response"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openResponseModal(request, 'accept')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Accept Request
                    </button>
                    <button
                      onClick={() => openResponseModal(request, 'reject')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {responseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            {/* Modal Header */}
            <div className={`p-6 rounded-t-2xl ${
              responseAction === 'accept' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    {responseAction === 'accept' ? 'Accept' : 'Reject'} Hire Request
                  </h3>
                  <p className="text-white text-sm font-semibold">
                    Request #{selectedRequest.request_id} - {selectedRequest.employee_name}
                  </p>
                </div>
                <button
                  onClick={closeResponseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                  disabled={submitting}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-semibold">Employer:</span>
                    <p className="text-black font-bold">{selectedRequest.employer_company}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Candidate:</span>
                    <p className="text-black font-bold">{selectedRequest.employee_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Position:</span>
                    <p className="text-black font-bold">{selectedRequest.employee_field}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Location:</span>
                    <p className="text-black font-bold">{selectedRequest.employee_location}</p>
                  </div>
                </div>
              </div>

              {/* Response Message */}
              <div>
                <label className="block font-black text-black mb-3 text-sm">
                  Response Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={`Enter your ${responseAction === 'accept' ? 'acceptance' : 'rejection'} message to the employer...`}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-all duration-200 font-medium resize-none"
                  disabled={submitting}
                  required
                />
                <p className="text-gray-500 text-xs mt-2">
                  {responseAction === 'accept' 
                    ? 'Provide details about next steps, contact information, or any other relevant information.'
                    : 'Provide a professional reason for the rejection.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeResponseModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-black py-3 px-4 rounded-lg transition-all duration-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResponseSubmit}
                  disabled={submitting || !responseMessage.trim()}
                  className={`flex-1 ${
                    responseAction === 'accept' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-black py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {responseAction === 'accept' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      Confirm {responseAction === 'accept' ? 'Accept' : 'Reject'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
