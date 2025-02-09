import express from "express";
import { getAllProducts, getProductById, addProduct, editProduct, getProductsSortedByRating, searchProducts, filterProducts , archiveProduct,unArchiveProduct ,addReview , getReviews, getAllReviews} from "../controllers/product.controller.js";
import { createProductValidator, editProductValidator, filterProductsValidator, } from "../utils/validators/product.validators.js";
import {createReviewValidator } from "../utils/validators/review.validators.js";

import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";
import { upload } from "../middlewares/uploadFileMiddleware.js";

const router = express.Router();
//
router.post('/create', verifyToken, authorizeRoles(['Seller','Admin']),addProduct);


router
  .route("/")
  .get(
    verifyToken,
    authorizeRoles(["Tourist", "Admin", "Seller"]),
    getAllProducts
  );



router
  .route("/")
  .post(
    verifyToken,
    authorizeRoles(["Admin", "Seller"]),
    createProductValidator,
    addProduct
  );

router
  .route("/:productId")
  .put(
    verifyToken,
    authorizeRoles(["Admin", "Seller"]),
    editProductValidator,
    editProduct
  );

router
  .route("/search")
  .get(
    verifyToken,
    authorizeRoles(["Tourist", "Admin", "Seller"]),
    searchProducts
  );

router
  .route("/filter")
  .get(
    verifyToken,
    authorizeRoles(["Tourist", "Admin", "Seller"]),
    filterProductsValidator,
    filterProducts
  );

router
  .route("/sort/rating")
  .get(
    verifyToken,
    authorizeRoles(["Tourist", "Admin", "Seller"]),
    getProductsSortedByRating
  );

  router
  .route("/archive/:productId")
  .post(
    verifyToken,
    authorizeRoles(["Admin", "Seller"]),
    archiveProduct
  );

  router
  .route("/unarchive/:productId")
  .post(
    verifyToken,
    authorizeRoles(["Admin", "Seller"]),
    unArchiveProduct
  );

  router
  .route("/review/:productId")
  .post(
    verifyToken,
    authorizeRoles(["Admin", "Seller","Tourist"]),
    createReviewValidator,
    addReview
  );

  router
  .route("/review")
  .get(
    verifyToken,
    authorizeRoles(["Admin", "Seller","Tourist"]),
    // createReviewValidator,
    getReviews
  );

  router
  .route("/:productId")
  .get(
    verifyToken,
    authorizeRoles(["Admin", "Seller" , "Tourist"]),
    getProductById
  );


  router.get("/review/:productId",verifyToken,authorizeRoles(["Tourist"]), getAllReviews)


export default router;