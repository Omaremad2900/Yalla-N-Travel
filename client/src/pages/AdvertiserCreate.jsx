import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdvertiserSideNav from "../components/advertiserSidenav";

const AdvertiserCreate = ({ advertiserService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);

  const [profile, setProfile] = useState({
    user_id: loggedInUser._id,
    website: '',
    hotline: '',
    company_profile: '',
    mobile: '',
    profilePicture: null, // Add profilePicture state
  });
  const [file, setFile] = useState(null); // For storing the uploaded profile picture
  const [previewUrl, setPreviewUrl] = useState(null); // For previewing the image
  const navigate = useNavigate();

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9\s\-+()]*$/;
    return phoneRegex.test(number);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (profile.hotline && !validatePhoneNumber(profile.hotline)) {
        alert('Please enter a valid hotline number.');
        return;
      }
  
      let updatedProfilePicture = profile.profilePicture; // Store current profile picture
  
      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file); // Append the file to the form data
  
        // Upload the picture and get the image URL
        updatedProfilePicture = await advertiserService.uploadProfilePicture(formData);
        console.log(updatedProfilePicture); // Log the updated profile picture URL
  
        // Update the profile state with the new profile picture URL
        setProfile((prevState) => ({
          ...prevState,
          profilePicture: updatedProfilePicture,
        }));
      }
  
      // Use the updated profile state by creating profileData after state has been set
      const profileData = {
        user_id: loggedInUser._id,
        website: profile.website,
        hotline: profile.hotline,
        company_profile: profile.company_profile,
        mobile: profile.mobile,
        profilePicture: updatedProfilePicture, // Use updated value here
      };
  
      console.log('Profile Data to be sent:', profileData); // Log the final profile data
  
      // Proceed with creating the profile
      await advertiserService.createAdvertiserProfile(profileData);
      alert('Profile created successfully');
      navigate('/AdvertiserRead');
  
      // Reset the profile state after success
      setProfile({
        user_id: loggedInUser._id,
        website: '',
        hotline: '',
        company_profile: '',
        mobile: '',
        profilePicture: null, // Reset profilePicture as well
      });
    } catch (error) {
      alert('Error creating profile');
      console.error('Error creating profile:', error);
    }
  };
  
  

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <AdvertiserSideNav />

      {/* Main content */}
      <div className="flex-1 p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Create Advertiser Profile</h1>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Company Website"
            className="border p-3 rounded-lg"
            name="website"
            value={profile.website}
            onChange={handleProfileChange}
            required
          />
          <input
            type="text"
            placeholder="Company Hotline"
            className="border p-3 rounded-lg"
            name="hotline"
            value={profile.hotline}
            onChange={handleProfileChange}
          />
          <textarea
            name="company_profile"
            placeholder="Enter company profile"
            className="border p-3 rounded-lg h-32"
            value={profile.company_profile}
            onChange={handleProfileChange}
            required
          />
          <input
            name="mobile"
            type="text"
            placeholder="Enter mobile number"
            className="border p-3 rounded-lg"
            value={profile.mobile}
            onChange={handleProfileChange}
          />

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-blue-800 font-bold mb-2" htmlFor="profilePicture">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="border p-3 rounded-lg"
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
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvertiserCreate;
