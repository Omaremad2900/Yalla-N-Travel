import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import TourguideService from '../services/Tourguideservice';

const TourguideCreate = () => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState({
    name: loggedInUser?.name || '',
    email: loggedInUser?.email || '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    profilePicture: null, // Add profilePicture state
  });
  const [file, setFile] = useState(null); // For storing the uploaded profile picture

  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

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

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    try {
      let updatedProfilePicture = profile.profilePicture; // Store current profile picture

      if (file) {
        console.log("in File")
        const formData = new FormData();
        formData.append('profile-picture', file); // Append the file to the form data
        updatedProfilePicture = await TourguideService.uploadProfilePicture(formData); // Assuming SellerService has this method
        setProfile((prevState) => ({
          ...prevState,
          profilePicture: updatedProfilePicture,
        }));
      }
      console.log(updatedProfilePicture)
      const tourGuideCreated=await TourguideService.createTourGuide({
        ...profile,
        profilePicture: updatedProfilePicture,
      });
      if(tourGuideCreated.status=="201"){

      alert('Profile created successfully');
      navigate('/TourguideRead'); // Navigate to TourguideRead after successful profile creation
    }
    } catch (error) {
      alert('Error creating profile');
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Create Tour Guide Profile</h1>
      <form onSubmit={handleCreateProfile} className="flex flex-col gap-4">
        <input
          type="text"
          name="mobileNumber"
          value={profile.mobileNumber}
          onChange={handleProfileChange}
          placeholder="Mobile Number"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="number"
          name="yearsOfExperience"
          value={profile.yearsOfExperience}
          onChange={handleProfileChange}
          placeholder="Years of Experience"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          name="previousWork"
          value={profile.previousWork}
          onChange={handleProfileChange}
          placeholder="Previous Work (if any)"
          className="border p-3 rounded-lg"
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
  );
};

export default TourguideCreate;
