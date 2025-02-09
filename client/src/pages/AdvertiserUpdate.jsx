import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdvertiserSideNav from "../components/advertiserSidenav";

const AdvertiserUpdate = ({ advertiserService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);

  const [profile, setProfile] = useState({
    user_id: loggedInUser._id,
    website: '',
    hotline: '',
    company_profile: '',
    mobile: '',
    profilePicture: ''
  });

  const navigate = useNavigate();
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); // For storing the uploaded profile picture
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await advertiserService.getAdvertiserProfileById(loggedInUser._id);
        if (response) {
          setProfile(response);
          setOriginalProfile(response);
          setPreviewUrl(response.profilePicture);
        }
      } catch (error) {
        alert('Profile not found');
        console.error('Error:', error);
      }
    };
    fetchProfile();
  }, [loggedInUser._id, advertiserService]);

  const validatePhoneNumber = (number) => /^[0-9\s\-+()]*$/.test(number);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]; // Get the uploaded file
    if (uploadedFile) {
      setFile(uploadedFile);

      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the preview as the uploaded image's data URL
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (profile.hotline && !validatePhoneNumber(profile.hotline)) {
      alert('Please enter a valid hotline number.');
      return;
    }

    try {
      let updatedProfilePicture = profile.profilePicture;

      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file); // Append the file to the form data

        // Upload the picture and get the image URL
        updatedProfilePicture = await advertiserService.uploadProfilePicture(formData);

        // Update the profile state with the new profile picture URL
        setProfile((prevState) => {
          const updatedProfile = {
            ...prevState,
            profilePicture: updatedProfilePicture,
          };

          // Call the update function with the updated profile
          advertiserService.updateAdvertiserProfile(loggedInUser._id, updatedProfile);
          return updatedProfile;
        });
        alert('Profile updated successfully');
        setOriginalProfile(profile);
        navigate("/AdvertiserRead");
      } else {
        advertiserService.updateAdvertiserProfile(loggedInUser._id, profile);
        alert('Profile updated successfully');
        setOriginalProfile(profile);
        navigate("/AdvertiserRead");
      }
    } catch (error) {
      alert("Profile can't be updated");
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <AdvertiserSideNav />

      {/* Main content for profile update form */}
      <div className="flex-1 flex items-start justify-center pt-10 bg-white">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl text-center font-semibold text-gray-800 mb-7">Update Advertiser Profile</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Company Website"
              className="border p-3 rounded-lg focus:outline-none"
              name="website"
              value={profile.website}
              onChange={handleProfileChange}
              required
            />
            <input
              type="text"
              placeholder="Company Hotline"
              className="border p-3 rounded-lg focus:outline-none"
              name="hotline"
              value={profile.hotline}
              onChange={handleProfileChange}
            />
            <textarea
              placeholder="Company Profile"
              className="border p-3 rounded-lg focus:outline-none h-32"
              name="company_profile"
              value={profile.company_profile}
              onChange={handleProfileChange}
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="border p-3 rounded-lg focus:outline-none"
              name="mobile"
              value={profile.mobile}
              onChange={handleProfileChange}
            />

            {/* Profile Picture Section */}
            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="profilePicture">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="border p-3 rounded-lg focus:outline-none"
              />
              {previewUrl && (
                <div className="mt-4">
                  <h4 className="text-xl mb-2">Image Preview:</h4>
                  <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserUpdate;
