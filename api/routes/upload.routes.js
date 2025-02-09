import express from "express";
const router = express.Router();
import { upload } from "../middlewares/uploadFileMiddleware.js";
import {uploadProductImage , uploadMultipleImages} from "../controllers/upload.controller.js"



// Define the route for uploading product images
router.post('/product', upload.single('product'), uploadProductImage);
router.post('/national-id', upload.single('nationalId'), uploadProductImage);
router.post('/credentials', upload.single('credentials'), uploadProductImage);
router.post('/multiple', upload.array('places',10),uploadMultipleImages)
router.post('/profile-picture',  upload.single('profile-picture'),uploadProductImage)
router.post('/activity-picture', upload.array('activity-picture',10), uploadMultipleImages);




export default router;
