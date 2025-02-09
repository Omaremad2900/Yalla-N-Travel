import React, { useState } from 'react';
// Import the sidebar component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import SellerSideNav from '../components/SellerSideNav';
import { ProSidebarProvider } from "react-pro-sidebar";

const SellerCreate = ({ SellerService }) => {
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    mobile: '',
    profilePicture: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null); // For storing the uploaded profile picture
  const navigate = useNavigate(); // Initialize navigate

  // Handle form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle file change for profile picture
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

  // Handle form submission to create seller profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedProfilePicture = profile.profilePicture; // Store current profile picture
      console.log(updatedProfilePicture)

      // Handle file upload if file exists
      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file); // Append the file to the form data
        updatedProfilePicture = await SellerService.uploadProfilePicture(formData); // Assuming SellerService has this method
        setProfile((prevState) => ({
          ...prevState,
          profilePicture: updatedProfilePicture,
        }));
      }

      // Proceed with creating the seller profile
      const sellerCreated=await SellerService.createSeller({
        ...profile,
        profilePicture: updatedProfilePicture,
      });
      // console.log(sellerCreated.success)
      if(sellerCreated){
      alert('Seller profile created successfully');
      navigate('/SellerRead'); // Navigate to SellerRead page after successful profile creation
      }
    } catch (err) {
      console.error(err);
      alert('Error creating seller profile');
    }
  };

  return (
    <ProSidebarProvider>
      <div className="flex min-h-screen bg-slate-100">
        {/* Sidebar */}
        <SellerSideNav />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-slate-200 p-8 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Create Seller Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div>
                <label className="block text-blue-800 font-bold mb-2" htmlFor="profilePicture">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="border-2 border-slate-600 rounded-md p-2 w-full"
                  accept="image/*"
                />
                {/* Preview Image */}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="mt-4 w-32 h-32 rounded-full object-cover border border-slate-400"
                  />
                )}
              </div>

              {/* Seller Name */}
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
                  className="border-2 border-slate-600 rounded-md p-3 w-full"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-blue-800 font-bold mb-2" htmlFor="mobile">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  placeholder="Enter mobile number"
                  className="border-2 border-slate-600 rounded-md p-3 w-full"
                  required
                />
              </div>

              {/* Seller Description */}
              <div>
                <label className="block text-blue-800 font-bold mb-2" htmlFor="description">
                  Seller Description
                </label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleProfileChange}
                  placeholder="Enter seller description"
                  className="border-2 border-slate-600 rounded-md p-3 w-full h-32"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-600 transition duration-200"
              >
                Create Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default SellerCreate;
