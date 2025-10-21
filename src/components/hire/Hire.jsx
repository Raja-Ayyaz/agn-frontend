import { ArrowRight, Menu, X } from "lucide-react"
import { useState } from "react"

export default function HirePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    employer_id: '',
    username: '',
    company_name: '',
    email: '',
    password: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // create payload (omit employer_id since DB will auto-increment)
    const payload = {
      username: formData.username,
      company_name: formData.company_name,
      email: formData.email,
      password: formData.password,
    }

    fetch('http://localhost:8000/insert_employer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data)
        setSubmitted(true)
        setFormData({ employer_id: '', username: '', company_name: '', email: '', password: '' })
        setTimeout(() => setSubmitted(false), 5000)
      })
      .catch((err) => console.error('Error:', err))
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-yellow-400 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-lg">AGN</span>
            </div>
            <span className="hidden sm:inline font-black text-black text-sm">MITCHELL ADAM</span>
            <span className="hidden sm:inline font-black text-black text-sm">AGN job bank</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-black font-bold hover:opacity-70 transition text-sm">HOME</a>
            <a href="/apply" className="text-black font-bold hover:opacity-70 transition text-sm">APPLY</a>
          </div>
          <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <section className="bg-yellow-400 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4">Hire with Mitchell Adam</h1>
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4">Hire with AGN job bank</h1>
          <p className="text-lg text-black mb-2 max-w-2xl leading-relaxed font-medium">Create your employer account and post roles.</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {submitted && (
            <div className="mb-8 bg-green-50 border-2 border-green-400 rounded-xl p-6 flex items-start gap-4">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-black">✓</span>
              </div>
              <div>
                <h3 className="font-black text-green-900 text-lg mb-1">Employer Registered!</h3>
                <p className="text-green-800">We've saved your employer details.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-black text-black mb-6">Employer Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2">Username *</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Company Name</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2">Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required maxLength={15} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-black text-yellow-400 hover:bg-gray-900 font-black text-lg px-8 py-6 rounded-xl">Create Employer <ArrowRight className="ml-2" size={20} /></button>
              <a href="/" className="flex-1 border-2 border-black text-black hover:bg-black hover:text-yellow-400 font-black text-lg px-8 py-6 rounded-xl bg-white">Back</a>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
