import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const { loading, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false); // Track if the form is expanded

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset the message before making the request
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      // Handle failure from API
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setMessage(data.message); // Set error message
        return;
      }

      // Dispatch success and set success message
      dispatch(signInSuccess(data));
      setMessage('Login successful! Redirecting...');
    } catch (error) {
      dispatch(signInFailure(error.message));
      setMessage('An error occurred. Please try again.'); // Set error message
    }
  };

  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role;
      const completed = currentUser.isCompleted;

      switch (role) {
        case 'Advertiser':
          navigate(completed ? '/AdvertiserHome' : '/AdvertiserCreate');
          break;
        case 'Seller':
          navigate(completed ? '/SellerHome' : '/SellerCreate');
          break;
        case 'Tour Guide':
          navigate(completed ? '/Tourguidehomepage' : '/TourguideCreate');
          break;
        case 'Tourist':
          navigate('/TouristHome');
          break;
        case 'Tourism Governor':
          navigate('/TourismgovernerHome');
          break;
        case 'Admin':
          navigate('/Admin');
          break;
        default:
          navigate('/');
      }
    }
  }, [currentUser, navigate]);

  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://i.imgur.com/ZR4EL31.png')",
  }}
>
  {/* Main card */}
  <div
    className={`p-10 w-[600px] mx-auto bg-white shadow-2xl rounded-3xl z-10 transition-all duration-500 ease-in-out ${
      isExpanded ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
    }`}
    onClick={() => setIsExpanded(true)} // Expand on click
    onMouseEnter={() => setIsExpanded(true)} // Expand on hover
    onMouseLeave={() => setIsExpanded(false)} // Shrink back when not hovering
  >
    <h1 className="text-4xl text-center font-semibold my-7">Sign In</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="email"
        placeholder="Email"
        className="border p-4 rounded-lg text-lg"
        id="email"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-4 rounded-lg text-lg"
        id="password"
        onChange={handleChange}
      />
      <button
        disabled={loading}
        className="bg-slate-700 text-white p-4 rounded-lg text-lg uppercase hover:opacity-95 disabled:opacity-80"
      >
        {loading ? 'Loading...' : 'Sign In'}
      </button>
    </form>

    {/* Forgot Password and Sign Up Links */}
    <div className="flex flex-col items-center mt-5 gap-4">
      <Link to="/ForgotPassword" className="text-blue-700 text-lg">
        Forgot Password?
      </Link>
      <div className="flex gap-1 text-lg">
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>

    {/* Show success or error messages */}
    {message && (
      <p
        className={`mt-5 text-lg ${
          message.includes('success') ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {message}
      </p>
    )}
  </div>
</div>

  
  );  
  
}
