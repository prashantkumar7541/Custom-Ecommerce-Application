import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../user/navbar/navbar";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [otp, setOtp] = useState(['','','','','','']);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const storedSellerId = sessionStorage.getItem('sellerId');
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSignup = async () => {
    if (!emailId || !password || !phoneNumber) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/seller/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          emailId,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowVerificationOptions(true);
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleVerificationMethodSelect = async (method) => {
    setVerificationMethod(method);
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/seller/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          emailId
        })
      });

      if (!response.ok) {
        setError('Failed to send OTP. Please try again.');
      } else {
        setResendDisabled(true);
        setResendTimer(30);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/seller/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailId })
      });

      if (response.ok) {
        setResendDisabled(true);
        setResendTimer(30);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const completeOtp = otp.join('');
    if (completeOtp.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/seller/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp: completeOtp,
          emailId
        })
      });

      const data = await response.json();

      if (response.ok && data.message === 'OTP verified successfully') {
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Signup | Mera Bestie</title>
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden sm:max-w-lg lg:max-w-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 120
            }}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Admin Signup
                </h2>
                <p className="text-pink-600 mt-2 text-sm sm:text-base">
                  {showVerificationOptions ? 'Choose Verification Method' : 'Create your Admin Account'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
                  {error}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                {!showVerificationOptions ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="flex items-center">
                          <span className="mr-1">🇮🇳</span>
                          <span className="text-gray-500">+91</span>
                        </div>
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        maxLength="10"
                        pattern="[0-9]{10}"
                        className="w-full pl-20 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setPhoneNumber(value);
                          }
                        }}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-pink-400 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-pink-400 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm sm:text-base border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-600 transition"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </>
                ) : !verificationMethod ? (
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                    <button
                      onClick={() => handleVerificationMethodSelect('email')}
                      className="flex flex-col items-center p-4 sm:p-6 border-2 border-pink-300 rounded-xl hover:border-pink-500 transition-colors"
                    >
                      <Mail size={36} className="text-pink-500 mb-2" />
                      <span className="text-gray-700 text-sm sm:text-base">Email</span>
                    </button>
                    <button
                      onClick={() => handleVerificationMethodSelect('phone')}
                      className="flex flex-col items-center p-4 sm:p-6 border-2 border-pink-300 rounded-xl hover:border-pink-500 transition-colors"
                    >
                      <Phone size={36} className="text-pink-500 mb-2" />
                      <span className="text-gray-700 text-sm sm:text-base">Phone</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          className="w-10 h-10 sm:w-12 sm:h-12 text-center text-sm sm:text-base border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleResendOtp}
                      disabled={resendDisabled}
                      className={`w-full py-2 text-xs sm:text-sm ${resendDisabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-pink-500 hover:text-pink-600'}`}
                    >
                      {resendTimer > 0 
                        ? `Resend OTP in ${resendTimer}s` 
                        : 'Resend OTP'}
                    </button>
                  </>
                )}

                <motion.button
                  type="button"
                  className="w-full bg-pink-500 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-pink-600 transition duration-300 transform active:scale-95"
                  whileTap={{ scale: 0.95 }}
                  onClick={verificationMethod ? handleVerifyOtp : handleSignup}
                >
                  {verificationMethod ? 'Verify OTP' : 'Sign Up'}
                </motion.button>

                <div className="text-center mt-4">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Already a seller?{' '}
                    <Link to="/seller/login" className="text-pink-500 hover:text-pink-600 font-semibold">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminSignup;
