import React, { useState, useEffect } from 'react';
import AdminService from '../services/adminService'; // Adjust the import path accordingly
import AdminSideNav from '../components/adminSidenav'; // Import the AdminSideNav component

const ManageActivityCategories = () => {
  const [activityCategories, setActivityCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AdminService.getActivityCategories();
        if (response.success && Array.isArray(response.data)) {
          setActivityCategories(response.data);
        } else {
          console.error('Unexpected Activity Categories Response:', response);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const categoryData = { name: newCategory };

    try {
      const response = await AdminService.addActivityCategory(categoryData);
      if (response.success) {
        setActivityCategories([...activityCategories, response.data]);
        setNewCategory('');
      } else {
        console.error('Unexpected Add Activity Category Response:', response);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const categoryData = { name: editCategoryValue };

    try {
      const response = await AdminService.updateActivityCategory(editCategoryId, categoryData);
      if (response.success) {
        setActivityCategories(
          activityCategories.map((category) =>
            category._id === editCategoryId ? response.data : category
          )
        );
        setEditCategoryId(null);
        setEditCategoryValue('');
      } else {
        console.error('Unexpected Update Activity Category Response:', response);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await AdminService.deleteActivityCategory(categoryId);
        if (response.success) {
          setActivityCategories(activityCategories.filter((category) => category._id !== categoryId));
        } else {
          console.error('Failed to delete category:', response);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="flex">
      <AdminSideNav /> {/* Add the AdminSideNav component here */}
      <div className="flex-1 p-6 bg-gray-100 rounded shadow-md">
        <h3 className="text-xl font-bold mb-4">Manage Activity Categories</h3>

        {activityCategories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Category Name</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activityCategories.map((category) => (
                <tr key={category._id}>
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        setEditCategoryId(category._id);
                        setEditCategoryValue(category.name);
                      }}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
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

        {/* Add or Update Activity Category Form */}
        <form
          onSubmit={editCategoryId ? handleUpdateCategory : handleAddCategory}
          className="mt-6 p-4 border rounded bg-white shadow"
        >
          <h4 className="font-semibold mb-4">
            {editCategoryId ? 'Update Activity Category' : 'Add Activity Category'}
          </h4>
          <div className="mb-4">
            <input
              type="text"
              value={editCategoryId ? editCategoryValue : newCategory}
              onChange={(e) =>
                editCategoryId ? setEditCategoryValue(e.target.value) : setNewCategory(e.target.value)
              }
              placeholder="Category Name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex space-x-2">
            {editCategoryId && (
              <button
                type="button"
                onClick={() => {
                  setEditCategoryId(null);
                  setEditCategoryValue('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
            <button type="submit"       className="bg-slate-700 text-white border-2 border-slate-700 py-1 px-4 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none ml-auto">
              {editCategoryId ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageActivityCategories;
