// controllers/seller.controller.js
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import SellerService from "../services/seller.service.js";

// Create an instance of the SellerService
const sellerService = new SellerService();

// @desc    Create a seller
// @route   /api/seller/createSeller
// @Access   Private/Protected
export const createSeller = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== "Seller") {
      return next(
        new ApiError("You must be a seller to create a new account", 404)
      );
    }

    const sellerData = {
      name: req.body.name,
      description: req.body.description,
      mobile: req.body.mobile,
      profilePicture: req.body.profilePicture,
    };

    const newSeller = await req.container
      .resolve("sellerService")
      .createSellerProfile(req.user.id, sellerData);

    res.status(StatusCodes.CREATED).json(newSeller);
  } catch (error) {
    console.error("Error creating Seller profile:", error);
    next(error);
  }
});

// @desc    Get Seller
// @route   GET /api/seller/:id
// @Access  Private/Protected
export const getSeller = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const seller = await req.container
      .resolve("sellerService")
      .getSellerById(userId);
    res.status(StatusCodes.OK).json({ data: seller });
  } catch (error) {
    next(error);
  }
});

// @desc    Update Seller
// @route   PUT /api/seller/updateSeller
// @Access  Private/Protected
export const updateSeller = asyncHandler(async (req, res, next) => {
  try {
    const updatedSeller = await req.container
      .resolve("sellerService")
      .updateSellerProfile(req.user.id, req.body); // Use req.user.id for both userId and sellerId
    res.status(StatusCodes.OK).json(updatedSeller);
  } catch (error) {
    console.error("Error updating seller profile:", error);
    next(error);
  }
});

export const getProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const sellerService = await req.container.resolve("sellerService");
    const products = await sellerService.getProductForSeller(
      userId,
      page,
      limit
    );
    res.status(StatusCodes.OK).json({ data: products });
  } catch (error) {
    next(error);
  }
};

export const requestDeleteSeller = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sellerService = await req.container.resolve("sellerService");

    const seller = await sellerService.getSellerById(userId);
    const sellerId = seller._id;
    const productId = await sellerService.getoneProductForSeller(userId);
    console.log(productId);

    const requestedSeller = await sellerService.requestAccountDeletion(
      sellerId,
      userId,
      productId
    );

    res
      .status(StatusCodes.OK)
      .json({ data: requestedSeller, message: "Account Deleted" });
  } catch (err) {
    next(err);
  }
};

export const getSellerRevenue = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productName, startDate, endDate, month } = req.query;
    const sellerService = await req.container.resolve("sellerService");
    const revenueReport = await sellerService.getSellerRevenue(userId, {
      productName,
      startDate,
      endDate,
      month,
    });
    res.status(StatusCodes.OK).json({ data: revenueReport });
  } catch (error) {
    next(error);
  }
});
