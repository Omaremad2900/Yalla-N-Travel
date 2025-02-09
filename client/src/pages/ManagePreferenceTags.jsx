import React, { useState, useEffect } from 'react';
import AdminService from '../services/adminService'; // Adjust the import path accordingly
import AdminSideNav from '../components/adminSidenav'; // Import the AdminSideNav component

const ManagePreferenceTags = () => {
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editTagId, setEditTagId] = useState(null);
  const [editTagValue, setEditTagValue] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await AdminService.getPreferenceTags();
        console.log(response);
        if (response) {
          setPreferenceTags(response.tags);
        } else {
          console.error('Unexpected Preference Tags Response:', response);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleAddTag = async (e) => {
    e.preventDefault();
    const tagData = { name: newTag };

    try {
      const response = await AdminService.addPreferenceTag(tagData);
      console.log(response);
      if (response) {
        setPreferenceTags([...preferenceTags, response.tag]);
        setNewTag('');
      } else {
        console.error('Unexpected Add Preference Tag Response:', response);
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleUpdateTag = async (e) => {
    e.preventDefault();
    const tagData = { name: editTagValue };

    try {
      const response = await AdminService.updatePreferenceTag(editTagId, tagData);
      if (response) {
        setPreferenceTags(
          preferenceTags.map((tag) =>
            tag._id === editTagId ? response.updatedTag : tag
          )
        );
        setEditTagId(null);
        setEditTagValue('');
      } else {
        console.error('Unexpected Update Preference Tag Response:', response);
      }
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        const response = await AdminService.deletePreferenceTag(tagId);
        if (response) {
          setPreferenceTags(preferenceTags.filter((tag) => tag._id !== tagId));
        } else {
          console.error('Failed to delete tag:', response);
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  return (
    <div className="flex">
      <AdminSideNav /> {/* Add the AdminSideNav component here */}
      <div className="flex-1 p-6 bg-gray-100 rounded shadow-md">
        <h3 className="text-xl font-bold mb-4">Manage Preference Tags</h3>

        {preferenceTags.length === 0 ? (
          <p className="text-gray-500">No tags found.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tag Name</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {preferenceTags.map((tag) => (
                <tr key={tag._id}>
                  <td className="py-2 px-4 border-b">{tag.name}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        setEditTagId(tag._id);
                        setEditTagValue(tag.name);
                      }}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add or Update Preference Tag Form */}
        <form
          onSubmit={editTagId ? handleUpdateTag : handleAddTag}
          className="mt-6 p-4 border rounded bg-white shadow"
        >
          <h4 className="font-semibold mb-4">
            {editTagId ? 'Update Preference Tag' : 'Add Preference Tag'}
          </h4>
          <div className="mb-4">
            <input
              type="text"
              value={editTagId ? editTagValue : newTag}
              onChange={(e) =>
                editTagId ? setEditTagValue(e.target.value) : setNewTag(e.target.value)
              }
              placeholder="Tag Name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex space-x-2">
            {editTagId && (
              <button
                type="button"
                onClick={() => {
                  setEditTagId(null);
                  setEditTagValue('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          <button type="submit" className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none">
          {editTagId ? 'Update Tag' : 'Add Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePreferenceTags;
