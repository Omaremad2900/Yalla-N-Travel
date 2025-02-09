import React, { useState } from 'react';
import TourismSidenav from '../components/TourismSidenav';
const AddPlace = ({ tourismgovernorService }) => {
  const [placeDetails, setPlaceDetails] = useState({
    id: '',
    name: '',
    description: '',
    pictures: [],
    location: '',
    openingHours: '',
    ticketPrices: '',
    start_date: '',
    end_date: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [tagType, setTagType] = useState('');
    const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [tagIds, setTagIds] = useState([]); // For storing tag IDs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceDetails({ ...placeDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    if (selectedFiles.length > 0) {
      setPlaceDetails((prevDetails) => ({
        ...prevDetails,
        pictures: selectedFiles, // Store multiple files in the state
      }));
  
      // Generate previews for all selected files
      const filePreviews = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            resolve(reader.result); // Resolve the promise with the file result
          };
        });
      });
  
      // Wait until all file previews are generated
      Promise.all(filePreviews).then((results) => {
        setPreview(results); // Update preview with all generated file previews
      });
    }
  };

  const handleAddTag = async () => {
    if (tagInput && tagType) {
      try {

        setPlaceDetails((prevDetails) => ({
          ...prevDetails,
          tags: [...prevDetails.tags, {name: tagInput, type: tagType }]
        }));
        // Fetch the tag ID from the backend using your service
        const res = await tourismgovernorService.getTagId(tagInput, tagType);
        // console.log
        setTagIds((prevTagIds) => [...prevTagIds, res.data.tagId]);
        // Reset the input fields after adding the tag
        console.log(res.data.tagId)
        setTagInput('');
        setTagType('');
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    }
  };
  

  const handleRemoveTag = (tagToRemove) => {
    setPlaceDetails((prevDetails) => ({
      ...prevDetails,
      tags: prevDetails.tags.filter((tag) => tag.name !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadFormData = new FormData();
    placeDetails.pictures.forEach((file) => {
      uploadFormData.append('places', file);
    });

    const imageUrls = await tourismgovernorService.uploadPictures(uploadFormData);
    console.log(imageUrls)

      const jsonPayload = {
      name: placeDetails.name,
      description: placeDetails.description,
      location: placeDetails.location,
      openingHours: placeDetails.openingHours,
      ticketPrices: Number(placeDetails.ticketPrices),
      start_date: placeDetails.start_date,
      end_date: placeDetails.end_date,
      pictures: imageUrls, // Use the image URLs received from the upload
      tags: tagIds,
  };
  console.log(jsonPayload)
  // console.log(jsonPayload)


    try {

        await tourismgovernorService.addPlace(jsonPayload);
      // Reset form after successful submission
      setPlaceDetails({
        id: '',
        name: '',
        description: '',
        pictures: [],
        location: '',
        openingHours: '',
        ticketPrices: '',
        start_date: '',
        end_date: '',
        tags: [],
      });
      setFile(null);
      setPreview([]);
    } catch (error) {
      console.error('Failed to add or edit place:', error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <TourismSidenav />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {placeDetails.id ? 'Edit Place' : 'Add Place'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          name="name"
          value={placeDetails.name}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          name="description"
          value={placeDetails.description}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Location:</label>
        <input
          type="text"
          name="location"
          value={placeDetails.location}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Opening Hours:</label>
        <input
          type="text"
          name="openingHours"
          value={placeDetails.openingHours}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticket Prices:</label>
        <input
          type="number"
          name="ticketPrices"
          value={placeDetails.ticketPrices}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={placeDetails.start_date}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date:</label>
        <input
          type="date"
          name="end_date"
          value={placeDetails.end_date}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
      <div>
      <label className="block text-sm font-medium text-gray-700">Tags:</label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add a tag"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />

        <select
          value={tagType}
          onChange={(e) => setTagType(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="" disabled>Select Tag Type</option>
          <option value="Monuments">Monuments</option>
          <option value="Museums">Museums</option>
          <option value="Religious Sites">Religious Sites</option>
          <option value="Palaces/Castles">Palaces/Castles</option>

        </select>

        <button type="button" onClick={handleAddTag} className="bg-slate-700 text-white px-4 py-2 rounded-md">
          Add
        </button>
      </div>

      <div className="mt-2 space-x-2">
  {placeDetails.tags.map((tag, index) => (
    <span key={index} className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
      {tag.name} ({tag.type}){' '}
      <button type="button" onClick={() => handleRemoveTag(tag.name)} className="text-red-500 ml-2">
        x
      </button>
    </span>
  ))}
</div>
    </div>
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Pictures:</label>
        <input
          type="file"
          name="pictures"
          onChange={handleFileChange}
          accept="image/*"
          multiple // Allow multiple file uploads
          className="mt-2 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
  
        {/* Render multiple previews */}
        {preview.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-4">
            {preview.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-40 w-full object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
      </div>
  
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {placeDetails.id ? 'Update Place' : 'Add Place'}
        </button>
      </div>
    </form>
  </div>
  </div>
  </div>
    );
};

export default AddPlace;
