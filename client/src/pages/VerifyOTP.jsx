import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30); // Timer for OTP resend
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      setError('Email not found. Please return to the Forgot Password page.');
    }
  }, [email]);

  // Timer countdown for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResend = () => {
    console.log('Resending OTP to:', email);
    setTimer(30);
    setResendEnabled(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
     alert('Please enter the OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/user/verifyResetCode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetCode: otp }),
      });

      const data = await response.json();

      if (data.message === 'Reset Code Has Been Verified Successfully!') {
        navigate('/ResetPassword', { state: { email } });
      } else {
        alert(data.message || 'Failed to verify OTP.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 pt-12">
      {/* Step Indicator */}
      <p className="text-sm text-slate-500 mb-6">Step 2 of 3: Verify Your OTP</p>
  
      {/* Main Card */}
      <div className="bg-white p-8 rounded-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-700">Verify OTP</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Enter OTP"
          />
          <button
            type="submit"
            className={`w-full p-4 bg-slate-700 text-white border-2 border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        {error && <p className="mt-6 text-center text-lg text-red-600">{error}</p>}
        
        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {resendEnabled ? (
            <button
              onClick={handleResend}
              className="text-indigo-600 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-slate-500">
              Resend available in <span className="font-bold">{timer}s</span>
            </p>
          )}
        </div>
      </div>
  
      {/* Footer Links */}
      <div className="mt-10 text-center text-lg text-slate-500">
        <p>Need help? <a href="/About" className="text-indigo-600 hover:underline">Contact Support</a></p>
        <p className="mt-2">Go back to <a href="/sign-in" className="text-indigo-600 hover:underline">Sign In</a></p>
      </div>
    </div>
  );
  
};

export default VerifyOTP;
