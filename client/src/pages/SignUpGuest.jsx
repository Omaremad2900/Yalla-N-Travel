import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: '',
    date_of_birth: '',
    nationalId: '',
    credentials: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // To track hover and click state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'role') {
      if (value === 'Tour Guide') {
        setUploadMessage('Please upload your National ID document and credentials.');
      } else if (value === 'Advertiser' || value === 'Seller') {
        setUploadMessage('Please upload your National ID and taxation registry document.');
      } else {
        setUploadMessage('');
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setMessage('You must accept the terms and conditions to sign up.');
      return;
    }

    dispatch(signUpStart());
    setMessage('');

    try {
      let nationalIdUrl = '';
      if (formData.nationalId) {
        const nationalIdData = new FormData();
        nationalIdData.append('nationalId', formData.nationalId);
        const nationalIdRes = await axiosInstance.post('/upload/national-id', nationalIdData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        nationalIdUrl = nationalIdRes.data.imageUrl;
      }

      let credentialsUrl = '';
      if (formData.credentials) {
        const credentialsData = new FormData();
        credentialsData.append('credentials', formData.credentials);
        const credentialsRes = await axiosInstance.post('/upload/credentials', credentialsData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        credentialsUrl = credentialsRes.data.imageUrl;
      }

      const formDataToSend = {
        ...formData,
        nationalId: nationalIdUrl,
        credentials: credentialsUrl,
        acceptTerms,
      };

      const res = await axiosInstance.post('/api/auth/signup', formDataToSend);

      if (res.data && res.data.success) {
        dispatch(signUpSuccess(res.data.user));
        setMessage('Sign up successful! Redirecting...');
        navigate('/sign-in');
      } else {
        throw new Error(res.data.message || 'Signup failed');
      }
    } catch (err) {
      dispatch(signUpFailure(err.message));
      setMessage(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.imgur.com/ZR4EL31.png')",
      }}
    >
      {/* Main Card */}
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
        <h1 className="text-4xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            type="date"
            placeholder="Date of Birth"
            className="border p-4 rounded-lg text-lg"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-4 rounded-lg text-lg"
            required
          >
            <option value="">Select Role</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Advertiser">Advertiser</option>
            <option value="Seller">Seller</option>
          </select>

          {uploadMessage && <p className="text-gray-700 my-2">{uploadMessage}</p>}

          <input
            type="file"
            accept="application/pdf, image/*"
            className="border p-4 rounded-lg text-lg"
            name="nationalId"
            onChange={handleFileChange}
            required
          />

          {formData.role === 'Tour Guide' && (
            <input
              type="file"
              accept="application/pdf, image/*"
              className="border p-4 rounded-lg text-lg"
              name="credentials"
              onChange={handleFileChange}
              required
            />
          )}

          {(formData.role === 'Advertiser' || formData.role === 'Seller') && (
            <input
              type="file"
              accept="application/pdf, image/*"
              className="border p-4 rounded-lg text-lg"
              name="credentials"
              onChange={handleFileChange}
              required
            />
          )}

          {/* Accept terms checkbox */}
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            I accept the terms and conditions
          </label>

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

        {/* Show success or error messages */}
        {message && (
          <p className={`mt-5 text-lg ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
