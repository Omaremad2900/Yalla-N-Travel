import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TouristUpdate = ({ touristService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState({
    username: loggedInUser?.username || '', // Ensure an empty string as a fallback
    mobileNumber: '',
    nationality: '',
    date_of_birth: loggedInUser?.date_of_birth || '', // Ensure an empty string as a fallback
    occupationStatus: '',
    wallet: loggedInUser?.wallet || '', // Ensure an empty string as a fallback
  });

  // Fetch the original data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const touristData = await touristService.getTouristProfileById(loggedInUser._id);
        setProfile({
          username: touristData.data.user.username || '',
          mobileNumber: touristData.data.mobileNumber || '',
          nationality: touristData.data.nationality || '',
          date_of_birth: touristData.data.user.date_of_birth || '',
          occupationStatus: touristData.data.occupationStatus || '',
          wallet: touristData.data.wallet,
        });
      } catch (error) {
        alert("Profile not found")
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [loggedInUser._id, touristService]);

  // Handle form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Restrict mobileNumber input to only digits
    if (name === 'mobileNumber' && isNaN(value)) {
      return; // Prevent setting non-numeric values
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const profileData = { 
      mobileNumber: profile.mobileNumber,
      nationality: profile.nationality,
      occupationStatus: profile.occupationStatus,
    };
    try {
      await touristService.updateTouristProfile(loggedInUser._id, profileData);
      alert('Profile updated successfully');
      navigate('/TouristRead')
    } catch (error) {
      alert("Profile can't be updated")
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Update Tourist Profile</h1>
      <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
        <input
          type="tel"
          name="mobileNumber"
          value={profile.mobileNumber}
          onChange={handleProfileChange}
          placeholder="Mobile Number"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          name="nationality"
          value={profile.nationality}
          onChange={handleProfileChange}
          placeholder="Nationality"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          name="date_of_birth"
          value={profile.date_of_birth}
          className="border p-3 rounded-lg"
          disabled
          placeholder="Date of Birth"
        />
        <input
          type="text"
          name="occupationStatus"
          value={profile.occupationStatus}
          onChange={handleProfileChange}
          placeholder="Occupation Status"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          name="username"
          value={profile.username}
          className="border p-3 rounded-lg"
          disabled
          placeholder="Username"
        />
        <input
          type="text"
          name="wallet"
          value={profile.wallet}
          className="border p-3 rounded-lg"
          disabled
          placeholder="Wallet"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default TouristUpdate;
