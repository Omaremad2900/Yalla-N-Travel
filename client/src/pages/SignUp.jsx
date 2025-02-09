import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    mobileNumber: '',
    nationality: '',
    date_of_birth: '',
    occupationStatus: '',
    acceptTerms: false,
  });
  const [message, setMessage] = useState('');
  const [dobError, setDobError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // To track hover and click state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'date_of_birth') {
      setDobError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDobError('');
    setMessage('');
    
    if (!formData.acceptTerms) {
      setMessage('You must accept the terms and conditions.');
      return;
    }

    dispatch(signUpStart());
    try {
      const res = await fetch('/api/auth/signupTour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      dispatch(signUpSuccess(data.user));
      setMessage('Sign up successful! Redirecting...');
      navigate('/TouristHome');
    } catch (err) {
      dispatch(signUpFailure(err.message));
      setMessage(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://i.imgur.com/ZR4EL31.png')",
      }}
    >
      <div
        className={`p-10 mx-auto bg-white shadow-2xl rounded-3xl z-10 transition-all duration-500 ease-in-out ${
          isExpanded ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
        }`}
        style={{
          width: '500px', // Fixed width
          height: 'auto', // Auto height based on content
        }}
        onMouseEnter={() => setIsExpanded(true)} // Expand on hover
        onMouseLeave={() => setIsExpanded(false)} // Shrink back when not hovering
        onClick={() => setIsExpanded(true)} // Expand on click
      >
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-4 rounded-lg text-lg"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-4 rounded-lg text-lg"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-4 rounded-lg text-lg"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            className="border p-4 rounded-lg text-lg"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Nationality"
            className="border p-4 rounded-lg text-lg"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            className={`border p-4 rounded-lg text-lg ${dobError ? 'border-red-500' : ''}`}
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
          {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
          
          <select
            name="occupationStatus"
            value={formData.occupationStatus} 
            onChange={handleChange}
            required
            className="border p-4 rounded-lg text-lg"
          >
            <option value="" disabled>
              Select Occupation Status
            </option>
            <option value="job">Employee</option>
            <option value="student">Student</option>
          </select>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className="mr-2"
            />
            <label htmlFor="acceptTerms" className="text-gray-700">
              I accept the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white p-4 rounded-lg text-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>

        {message && (
          <p className={`mt-5 text-lg ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
