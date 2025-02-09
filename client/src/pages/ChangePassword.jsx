import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChangePassword = ({ userService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logged-in User:", loggedInUser);
  }, [loggedInUser]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.changePassword(newPassword, confirmPassword);
      alert(response.message);
      setNewPassword('');
      setConfirmPassword('');
      setError('');

      // Conditional navigation based on user role
      if (loggedInUser?.role === 'Advertiser') {
        navigate('/AdvertiserRead');
      } else if (loggedInUser?.role === 'Tourism Governor') {
        navigate('/TourismGovernorRead');
      } else if (loggedInUser?.role === 'Seller') {
        navigate('/SellerRead');
      } else if (loggedInUser?.role === 'Tour Guide') {
        navigate('/TourguideRead');
      }
      else if(loggedInUser?.role === 'Admin'){
        navigate('/AdminRead')
      }
      else{
        navigate('/TouristRead')
      }
    } catch (error) {
      alert(error.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar (if needed) */}
      {/* <AdvertiserSideNav /> */}

      {/* Main content */}
      <div className="flex-1 flex justify-center items-start min-h-screen pt-10 px-4 bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <h4 className="text-3xl font-semibold text-gray-800 mb-8">Change Password</h4>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="font-medium text-gray-700">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700">Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
