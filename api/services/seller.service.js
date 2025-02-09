// services/sellerService.js
import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import orderModel from "../models/order.model.js";

class SellerService {
  // Create a new seller profile
  async createSellerProfile(userId, sellerData) {
    // Check if a seller account already exists for the user
    const existingSeller = await Seller.findOne({ user: userId });
    if (existingSeller) {
      throw new ApiError(
        "Seller account already exists",
        StatusCodes.BAD_REQUEST
      );
    }
    // Create a new seller profile
    const newSeller = new Seller({
      user: userId,
      ...sellerData,
    });
    await newSeller.save();

    // Update the User to mark the profile as complete
    await User.findByIdAndUpdate(userId, { isCompleted: true });

    // Fetch and return the newly created seller profile with user details populated
    const populatedSeller = await Seller.findOne(newSeller._id).populate(
      "user",
      "username email role"
    );

    return populatedSeller;
  }
  // Get a seller profile by ID
  async getSellerById(userId) {
    const seller = await Seller.findOne({ user: userId }).populate(
      "user",
      "username email"
    );
    if (!seller) {
      throw new ApiError(
        `Couldn't find seller with id ${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return seller;
  }

  // Update a seller profile
  async updateSellerProfile(userId, updateData) {
    // Find the seller using userId
    const seller = await Seller.findOne({ user: userId }).populate(
      "user",
      "username email"
    );
    if (!seller) {
      throw new ApiError(
        `Couldn't find seller with user ID ${userId}`,
        StatusCodes.NOT_FOUND
      );
    }

    // Update the seller's data
    Object.assign(seller, updateData);
    await seller.save();

    return seller;
  }

  async getProductForSeller(sellerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Fetch the products for the specific seller with pagination
    const products = await Product.find({ seller: sellerId })
      .populate("seller")
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects for easier manipulation

    const totalProducts = await Product.countDocuments({ seller: sellerId });

    return {
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    };
  }
  async getoneProductForSeller(sellerId) {
    const product = Product.find({
      seller: sellerId,
    });

    return product;
  }

  async requestAccountDeletion(sellerId, userId, productId) {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new ApiError("Seller not found", StatusCodes.NOT_FOUND);
    }

    if (productId.length < 0) {
      throw new ApiError(
        "Cannt request deletion with products for sale",
        StatusCodes.NOT_FOUND
      );
    }

    const user = await User.findByIdAndDelete(userId);

    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { requestDelete: true },
    //   { new: true }
    // );
  }

  async getSellerRevenue(userId, { productName, startDate, endDate, month }) {
    // Step 1: Find all products by the seller and optionally filter by product name
    const productQuery = { seller: userId };
    if (productName) {
      productQuery.name = productName;
    }
    const products = await Product.find(productQuery);

    if (products.length === 0) {
      return { totalRevenue: 0, totalSales: 0, products: [] };
    }

    // Step 2: Calculate the date filter based on startDate, endDate, and month
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    if (month) {
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      dateFilter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Step 3: Filter products by date range if provided
    const filteredProducts = products.filter((product) => {
      const createdAt = new Date(product.createdAt);
      return (
        !dateFilter.createdAt ||
        (createdAt >= dateFilter.createdAt.$gte &&
          createdAt <= dateFilter.createdAt.$lte)
      );
    });

    // Step 4: Build the report
    let totalSales = 0;
    let totalRevenue = 0;
    const productBreakdown = filteredProducts.map((product) => {
      const salesCount = product.salesCount || 0;
      const revenue = salesCount * product.price;
      totalSales += salesCount;
      totalRevenue += revenue;
      return {
        productName: product.name,
        salesCount,
        revenue,
      };
    });

    return {
      totalSales,
      totalRevenue,
      products: productBreakdown,
    };
  }
}

export default SellerService;
