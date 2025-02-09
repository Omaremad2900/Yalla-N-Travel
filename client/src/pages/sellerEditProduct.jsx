import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileUpload from "../components/uploadFile"; // Import the FileUpload component

const SellerEditProduct = ({ SellerService }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    availableQuantity: "",
  });
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [preview, setPreview] = useState(null); // State for previewing the uploaded image
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await SellerService.getProduct(productId);
        setProduct(productData.data.product);

        // Set the initial preview as the current product image URL
        if (productData.data.product.imageUrl) {
          setPreview(`${productData.data.product.imageUrl}`);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [productId]);

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

      // Handle file upload only if a new file is uploaded
      if (file) {
        const formData = new FormData();
        formData.append("product", file); // Append the file to the form data
        updatedImageUrl = await SellerService.uploadProductImage(formData);
      }

      // Proceed with updating product details
      await SellerService.editProduct(productId, {
        ...product,
        imageUrl: updatedImageUrl,
      });
      navigate("/SellerProducts");
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Edit Product
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price:
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Available Quantity:
            </label>
            <input
              type="number"
              name="availableQuantity"
              value={product.availableQuantity}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Display current image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Product Image:
          </label>
          {preview ? (
            <img
              src={preview}
              alt="Product Preview"
              className="mt-2 h-40 object-cover"
            />
          ) : (
            <p className="mt-2 text-gray-500">No image uploaded</p>
          )}
        </div>

        {/* New: File Upload Component */}
        <div style={{ marginBottom: "15px" }}>
          <label>Product Image:</label>
          <input
            type="file"
            name="imageUrl"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerEditProduct;
