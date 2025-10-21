import { ArrowRight, Menu, X, Phone, Mail, MapPin, Linkedin, Twitter, Upload } from "lucide-react"
import { useState } from "react"

export default function ApplyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile_no: "",
    location: "",
    nearest_route: "",
    cnic_no: "",
    educational_profile: "",
    recent_completed_education: "",
    applying_for: "",
    experience: "",
    experience_detail: "",
  })
  const [cvFile, setCvFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key])
    })
    if (cvFile) {
      data.append("cv", cvFile)
    }

    fetch("http://localhost:8000/insert_employee", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result)
        setSubmitted(true)
        setFormData({
          name: "",
          age: "",
          email: "",
          mobile_no: "",
          location: "",
          nearest_route: "",
          cnic_no: "",
          educational_profile: "",
          recent_completed_education: "",
          applying_for: "",
          experience: "",
          experience_detail: "",
        })
        setCvFile(null)
        setTimeout(() => setSubmitted(false), 5000)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
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
            <a href="/#about" className="text-black font-bold hover:opacity-70 transition text-sm">
              ABOUT
            </a>
            <a href="/#contact" className="text-black font-bold hover:opacity-70 transition text-sm">
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
              <a href="/#about" className="block text-black font-bold hover:opacity-70 transition">
                ABOUT
              </a>
              <a href="/#contact" className="block text-black font-bold hover:opacity-70 transition">
                CONTACT
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-yellow-400 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4 text-balance">
            Apply for Your Next Finance Role
          </h1>
          <p className="text-lg text-black mb-2 max-w-2xl leading-relaxed font-medium">
            Join our network of finance professionals. Fill out the form below and let's find your perfect opportunity.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {submitted && (
            <div className="mb-8 bg-green-50 border-2 border-green-400 rounded-xl p-6 flex items-start gap-4">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-black">✓</span>
              </div>
              <div>
                <h3 className="font-black text-green-900 text-lg mb-1">Application Submitted!</h3>
                <p className="text-green-800">Thank you for applying. We'll be in touch soon.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black">
                  1
                </span>
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="28"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="07700 000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="Birmingham, UK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Nearest Route</label>
                  <input
                    type="text"
                    name="nearest_route"
                    value={formData.nearest_route}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="e.g., M5, M6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">CNIC/ID Number *</label>
                  <input
                    type="text"
                    name="cnic_no"
                    value={formData.cnic_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="12345-6789012-3"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black">
                  2
                </span>
                Education
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2">Educational Profile *</label>
                  <input
                    type="text"
                    name="educational_profile"
                    value={formData.educational_profile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="e.g., Bachelor's in Accounting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Recent Completed Education *</label>
                  <input
                    type="text"
                    name="recent_completed_education"
                    value={formData.recent_completed_education}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="e.g., ACCA, ACA, CIMA"
                  />
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black">
                  3
                </span>
                Experience
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2">Position Applying For *</label>
                  <input
                    type="text"
                    name="applying_for"
                    value={formData.applying_for}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="e.g., Senior Accountant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium"
                    placeholder="5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-2">Experience Details</label>
                <textarea
                  name="experience_detail"
                  value={formData.experience_detail}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition font-medium resize-none"
                  placeholder="Tell us about your relevant experience, key achievements, and why you're interested in this role..."
                />
              </div>
            </div>

            {/* CV Upload Section */}
            <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-300">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black">
                  4
                </span>
                Upload CV
              </h2>
              <div className="border-2 border-dashed border-yellow-400 rounded-xl p-8 text-center hover:bg-yellow-100 transition cursor-pointer relative">
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={40} className="mx-auto mb-3 text-yellow-600" />
                <p className="font-black text-black text-lg mb-1">
                  {cvFile ? cvFile.name : "Drop your CV here or click to browse"}
                </p>
                <p className="text-sm text-gray-600">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-xl"
              >
                Submit Application <ArrowRight className="ml-2" size={20} />
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 rounded-xl bg-white"
              >
                Back
              </button>
            </div>
          </form>
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
                  <a href="/#about" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    About
                  </a>
                </li>
                <li>
                  <a href="/apply" className="text-gray-400 hover:text-yellow-400 transition font-medium">
                    Apply
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
