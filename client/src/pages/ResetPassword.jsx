import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      setError('Email not found. Please return to Verify OTP page.');
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true); // Set loading to true when the submit button is clicked

    try {
      const response = await fetch('http://localhost:3000/api/user/resetPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (data.message && data.message.includes('success')) {
        alert("Password Changed")
        navigate('/sign-in');
      } else {
        alert(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Reset loading to false after the request is completed
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 pt-12">
      {/* Step Indicator */}
      <p className="text-sm text-slate-500 mb-6">Step 3 of 3: Reset Your Password</p>
  
      {/* Main Card */}
      <div className="bg-white p-8 rounded-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-700">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className={`w-full p-4 bg-slate-700 text-white border-2 border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {error && <p className="mt-6 text-center text-lg text-red-600">{error}</p>}
      </div>
  
      {/* Footer Links */}
      <div className="mt-10 text-center text-lg text-slate-500">
        <p>
          Remember your password? <a href="/sign-in" className="text-indigo-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
  
};

export default ResetPassword;
