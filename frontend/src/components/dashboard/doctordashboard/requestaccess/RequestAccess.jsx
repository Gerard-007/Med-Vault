import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RequestAccessBackgroundImage from '../../../../assets/images/woman-medic-cheering-with-hands-air.jpg'
import useUserAuthStore from '../../../../store/userAuthStore';
import { FiArrowRight, FiMail, FiRefreshCw, FiX } from 'react-icons/fi';

const RequestAccess = () => {
  const { user, setUser, setToken, setError, setLoading, clearError, error, isLoading } = useUserAuthStore();
  const navigate = useNavigate();
  // const location = useLocation();
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Start the timer when component mounts
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...verificationCode];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setVerificationCode(newCode);
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      clearError();

      await axios.post(
        'http://localhost:8080/publisher/resend-verification',
        { email: user?.email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      setTimer(60);
      setCanResend(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Verification Code Sent',
        text: 'A new verification code has been sent to your email',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
      setError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setFormErrors({ code: 'Please enter the complete verification code' });
      return;
    }

    try {
      setLoading(true);
      clearError();

      const response = await axios.post(
        'http://localhost:8080/publisher/verify-email',
        { 
          email: user?.email,
          code: code 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const { user: verifiedUser, token } = response.data;
      
      // Update Zustand store with verified user data
      setUser(verifiedUser);
      setToken(token);

      Swal.fire({
        icon: 'success',
        title: 'Email Verified!',
        text: 'Your email has been successfully verified',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = 'Invalid verification code';
            setFormErrors({ code: 'Invalid code. Please try again.' });
            break;
          case 401:
            errorMessage = 'Verification code expired';
            setFormErrors({ code: 'Code expired. Please request a new one.' });
            break;
          case 404:
            errorMessage = 'Email not found';
            break;
          default:
            errorMessage = data.message || 'Something went wrong. Please try again.';
        }
      }

      setError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: errorMessage,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side - Image Section */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-700">
          <img
            src={RequestAccessBackgroundImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-800/80 backdrop-blur-sm">
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
            <div className="w-20 h-20 mb-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <FiMail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-center tracking-tight">
              Verify Your Token
            </h1>
            <p className="text-xl text-white/90 text-center max-w-md leading-relaxed">
              We've sent a verification code to your email address. Please enter it below to continue.
            </p>
            <div className="mt-12 flex flex-col space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FiMail className="w-6 h-6" />
                </div>
                <span className="text-lg">Check your email inbox</span>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FiRefreshCw className="w-6 h-6" />
                </div>
                <span className="text-lg">Enter the 6-digit code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <FiMail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Enter Verification Code
            </h1>
            <p className="text-gray-600 mt-2">
              We sent a code to <span className="font-medium text-blue-600">{user?.email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center text-red-600">
                <FiX className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-14 h-14 text-center text-2xl rounded-xl border-2 ${
                      formErrors.code 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    } transition duration-200`}
                    required
                  />
                ))}
              </div>
              {formErrors.code && (
                <div className="mt-2 text-sm text-red-600 flex items-center justify-center">
                  <FiX className="w-4 h-4 mr-1" />
                  {formErrors.code}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className={`text-sm font-medium transition duration-200 ${
                  canResend 
                    ? 'text-blue-600 hover:text-blue-500' 
                    : 'text-gray-400'
                }`}
              >
                {canResend ? (
                  <span className="flex items-center justify-center">
                    <FiRefreshCw className="w-4 h-4 mr-1" />
                    Resend Code
                  </span>
                ) : (
                  `Resend in ${timer}s`
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium transition duration-200 transform hover:scale-[1.02] ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-6 w-6"></span>
                ) : (
                  <>
                    <span>Verify Access</span>
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Having trouble?{' '}
              <button
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RequestAccess
