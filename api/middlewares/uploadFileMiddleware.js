import multer from 'multer';
import path from 'path';
import apiError  from '../utils/apiError.js'; // Assuming ApiError is an exported class

// Set up storage engine using ES module syntax
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define where to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Check if the file was renamed by the client (which would have a 'Product-Image-' prefix)
    // if (file.originalname.startsWith('Product-Image-')) {
    //   // If the file already has a proper name, keep the client's file name
    //   cb(null, file.originalname); // Keep the file name as sent by the client
    // } else {
      // If no specific renaming was done on the client, use a unique file name on the server
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // Use unique filename
    }
  // }
});

// Initialize upload with ES module syntax
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new ApiError('Invalid file type. Only JPEG, PNG, and PDF files are allowed.', 400));
    }
  }
});
