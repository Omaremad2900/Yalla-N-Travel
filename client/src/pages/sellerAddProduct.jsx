import { useState } from 'react';
import SellerSideNav from '../components/SellerSideNav';
import { ProSidebarProvider } from "react-pro-sidebar";

const SellerAddProduct = ({ SellerService }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    availableQuantity: '',
  });
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [preview, setPreview] = useState(null); // State for previewing the uploaded image
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file change and preview
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]; // Get the uploaded file
    if (uploadedFile) {
      setFile(uploadedFile);

      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set the preview as the uploaded image's data URL
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedImageUrl = product.imageUrl; // Store current imageUrl

      // Handle file upload if file exists
      if (file) {
        const formData = new FormData();
        formData.append('product', file); // Append the file to the form data
        updatedImageUrl = await SellerService.uploadProductImage(formData);
        // Send the file to the server (assuming SellerService has a method for it)
        setProduct((prevState) => ({
          ...prevState,
          imageUrl: updatedImageUrl,
        }));
      }

      // Proceed with updating product details
      await SellerService.createProduct({
        ...product,
        imageUrl: updatedImageUrl,
      });
      alert('Product added successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to add product');
    }
  };

  return (
    <ProSidebarProvider>
    <div className="flex min-h-screen bg-slate-100">
      <SellerSideNav /> {/* Sidebar Component */}

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-slate-200 p-8 rounded-lg shadow-md max-w-lg w-full mt-10">
          <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">
            Add New Product
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="name">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="border-2 border-slate-600 rounded-md p-3 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter product price"
                className="border-2 border-slate-600 rounded-md p-3 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="description">
                Product Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="border-2 border-slate-600 rounded-md p-3 w-full h-24"
                required
              />
            </div>

            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="availableQuantity">
                Available Quantity
              </label>
              <input
                type="number"
                name="availableQuantity"
                value={product.availableQuantity}
                onChange={handleChange}
                placeholder="Enter available quantity"
                className="border-2 border-slate-600 rounded-md p-3 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-blue-800 font-bold mb-2">
                Current Product Image
              </label>
              {preview ? (
                <img
                  src={preview}
                  alt="Product Preview"
                  className="mt-2 h-40 object-cover"
                />
              ) : (
                <p className="mt-2 text-slate-500">No image uploaded</p>
              )}
            </div>

            <div>
              <label className="block text-blue-800 font-bold mb-2" htmlFor="imageUrl">
                Product Image
              </label>
              <input
                type="file"
                name="imageUrl"
                onChange={handleFileChange}
                className="border-2 border-slate-600 rounded-md p-3 w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-600 transition duration-200"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
    </ProSidebarProvider>
  );
};

export default SellerAddProduct;
