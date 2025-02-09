import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

const TourguideUpdate = ({Tourguideservice}) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState({
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    user: {
      email: '',
      username: '',
    },
    profilePicture:''
  });
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); // For storing the uploaded profile picture

  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/tourGuide/getTourGuide');
        if (response.data) {
          setProfile(response.data.data);
          setOriginalProfile(response.data.data);
          setPreviewUrl(response.data.data.profilePicture)
        }
      } catch (error) {
        alert('Profile not found');
        console.error('Error:', error);
      }
    };
    fetchProfile();
  }, [loggedInUser.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]; // Get the uploaded file
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("fileset")

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

    let updatedProfilePicture = profile.profilePicture; // Store current profile picture
  
      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file); // Append the file to the form data
  
        // Upload the picture and get the image URL
        updatedProfilePicture = await Tourguideservice.uploadProfilePicture(formData);
        
      }
      console.log(updatedProfilePicture)
      setProfile(async (prevState) => {
        const updatedProfile = {
          ...prevState,
          profilePicture: updatedProfilePicture,
        };
        console.log(updatedProfile.profilePicture)
        // Call the update function with the updated profile
        try {
        await Tourguideservice.updateTourGuide(updatedProfile);
        alert("Profile updated successfully");

        navigate('/TourGuideRead');
        }
        catch (error) {
          alert("Profile can't be updated");
          console.error('Error:', error);
        }
        // return updatedProfile;
      });
    
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Update Tour Guide Profile</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Mobile"
          className="border p-3 rounded-lg"
          name="mobileNumber"
          value={profile.mobileNumber}
          onChange={handleProfileChange}
          required
        />
        <input
          type="number"
          placeholder="Years of Experience"
          className="border p-3 rounded-lg"
          name="yearsOfExperience"
          value={profile.yearsOfExperience}
          onChange={handleProfileChange}
          required
        />
        <textarea
          placeholder="Previous Work"
          className="border p-3 rounded-lg h-32"
          name="previousWork"
          value={profile.previousWork}
          onChange={handleProfileChange}
          required
        />
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
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Update Profile
        </button>
      </form>
      
    </div>
  );
};

export default TourguideUpdate;
