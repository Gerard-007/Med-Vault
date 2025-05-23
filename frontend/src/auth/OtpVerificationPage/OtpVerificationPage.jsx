import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const userId = searchParams.get('userId')
  const role = searchParams.get('role') // 'doctor' or 'patient'

  useEffect(() => {
    if (!userId || !role) {
      navigate('/signup') // redirect if URL is invalid
    }
  }, [userId, role, navigate])

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return

    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullOtp = otp.join('')

    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Replace with your actual verification logic
      if (fullOtp === '123456') {
        navigate(`/${role}/dashboard`)
      } else {
        setError('Invalid verification code.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Verify your email</h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  )
}

export default OtpVerificationPage
