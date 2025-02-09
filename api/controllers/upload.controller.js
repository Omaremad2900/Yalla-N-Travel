export const uploadProductImage = async (req, res) => {
    try {
        console.log(req.file.filename)
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};

export const uploadMultipleImages = async (req, res) => {
    try {
        const uploadedFiles = req.files;

        // Map over the files array to return only the file names
        const imageUrls = uploadedFiles.map(file => `http://localhost:3000/uploads/${file.filename}`);
        res.status(200).json({ imageUrls });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};
