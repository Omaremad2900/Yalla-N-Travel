import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/user/forgotPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.message && data.message.includes('Verification code')) {
        alert('Password reset link sent to your email.');
        setEmail('');
        setMessage('');
        setTimeout(() => navigate('/VerifyOTP', { state: { email } }), 2000);
      } else {
        setMessage(data.message || 'Failed to send password reset email.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 pt-12">
      <p className="text-sm text-slate-500 mb-6">Step 1 of 3: Forgot Password</p>
  
      <div className="bg-white p-8 rounded-lg w-full max-w-lg mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8 text-slate-700">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Enter your email address"
          />
          <button
            type="submit"
            className={`w-full p-4 bg-slate-700 text-white border-2 border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Link'}
          </button>
        </form>
        {message && (
          <p
            className={`mt-6 text-center text-lg ${
              message.includes('sent') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
      <div className="mt-10 text-center text-lg text-slate-500">
        <p>
          Remember your password?{' '}
          <Link to="/sign-in" className="text-indigo-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
  
}
