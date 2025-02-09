import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SellerSideNav from '../components/SellerSideNav';
import { ProSidebarProvider } from "react-pro-sidebar"; 
import { useNavigate } from 'react-router-dom';

const SellerUpdate = ({ SellerService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);

  const [profile, setProfile] = useState({
    name: '',
    description: '',
    mobile:'',
    profilePicture: ''
  });
    
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await SellerService.getSeller(loggedInUser._id);
        if (response.data) {
          setProfile(response.data);
          setOriginalProfile(response.data);
          setPreviewUrl(response.data.profilePicture);
        }
      } catch (error) {
        alert('Profile not found');
        console.error('Error:', error);
      }
    };
    fetchProfile();
  }, [loggedInUser._id, SellerService]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let updatedProfilePicture = profile.profilePicture;
  
      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file);
        updatedProfilePicture = await SellerService.uploadProfilePicture(formData);
      }
  
      const updatedProfile = {
        ...profile,
        profilePicture: updatedProfilePicture,
      };

      if (JSON.stringify(updatedProfile) === JSON.stringify(originalProfile)) {
        alert('No changes made to the profile.');
        return;
      }

      await SellerService.updateSeller(updatedProfile);
      setOriginalProfile(updatedProfile);
      alert('Profile updated successfully');
      navigate("/SellerRead");
    } catch (error) {
      alert("Profile can't be updated");
      console.error('Error:', error);
    }
  };

  return (
    <ProSidebarProvider>
      <div className="flex min-h-screen bg-slate-100">
        <SellerSideNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-slate-200 p-8 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-center text-slate-700 mb-6">Update Seller Profile</h2>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-blue-800 font-bold mb-2" htmlFor="name">
                  Seller Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter seller name"
                  className="w-full border-2 border-slate-600 rounded-md p-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  className="w-full border-2 border-slate-600 rounded-md p-3 mt-4" 
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div>
                <label className="block text-blue-800 font-bold mb-2" htmlFor="description">
                  Seller Description
                </label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleProfileChange}
                  placeholder="Enter seller description"
                  className="w-full border-2 border-slate-600 rounded-md p-3 h-32"
                  required
                />
              </div>
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
                className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-600 transition duration-200"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default SellerUpdate;
