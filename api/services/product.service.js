import Product from "../models/product.model.js";

import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart.model.js";
import touristModel from "../models/tourist.model.js";
import WishList from "../models/wishlist.model.js";
import Seller from "../models/seller.model.js"; 
import Admin from "../models/admin.model.js";
import { sendOutofStockNotification, sendAppNotification } from "../utils/Jobs/mailer.js";

class ProductService {
  async getAllProducts(page = 1, limit = 10, userRole) {
    const skip = (page - 1) * limit;

    // Fetch products with pagination, including seller and review details
    const products = await Product.find()
      .populate('seller') // Populate seller details
      .populate({
        path: 'reviews',
        select: 'rating comment', // Only select rating and comment fields in reviews
      })
      .skip(skip)
      .limit(limit)
      .lean();

   
    // Fetch total count of products for pagination purposes
    const totalProducts = await Product.countDocuments();

    // Return products along with pagination information
    return {
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    }
  }

async getAllUnArchivedProducts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const products = await Product.find({ isArchived: false })
        .populate('seller')
        .populate({
          path: "reviews",
          select: "rating comment" // Select fields you want to show
      })
        .skip(skip)
        .limit(limit);

    const totalUnArchivedProducts = await Product.countDocuments({ isArchived: false });
    return {
        products,
        pagination: {
            total: totalUnArchivedProducts,
            page,
            limit,
            totalPages: Math.ceil(totalUnArchivedProducts / limit)
        }
    };
}
async getAllArchivedProducts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const products = await Product.find({ isArchived: true })
      .populate('seller')
      .populate({
        path: "reviews",
        select: "rating comment" // Select fields you want to show
    })
      .skip(skip)
      .limit(limit);

  const totalUnArchivedProducts = await Product.countDocuments({ isArchived: false });
  return {
      products,
      pagination: {
          total: totalUnArchivedProducts,
          page,
          limit,
          totalPages: Math.ceil(totalUnArchivedProducts / limit)
      }
  };
}

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
    }
    return product;
  }

  async createProduct(productData) {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  async editProduct(productId, updateData) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
    }

    return updatedProduct;
  }

  async sortByRatings(order) {
    return await Product.find().sort({ rating: order === "asc" ? 1 : -1 });
  }

  async filterProductsByPrice(minPrice, maxPrice) {
    return await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
  }

  async searchProductsByName(name) {
    return await Product.find({ name: { $regex: name, $options: "i" } });
  }
  
  async archiveProduct(productId) {
    const product = await Product.findByIdAndUpdate(productId, { isArchived: true });
    if (!product) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
  }
  async unArchiveProduct(productId) {
    const product = await Product.findByIdAndUpdate(productId, { isArchived: false });
    if (!product) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
  }

  async getProductsInMyCart (touristId){
      let cart = await Cart.findOne({ user: touristId }).sort({createdAt : -1}).  
      populate('products.productId').exec();
        if (!cart) {
          cart = new Cart({ user: touristId, products: [] });
          await cart.save();

        }
        return cart

  }
  async addItemToCart(touristId, productId, quantity) {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
        }

        if (product.isArchived || product.availableQuantity < quantity) {
            throw new ApiError("Product is not available in the desired quantity", StatusCodes.BAD_REQUEST);
        }

        let cart = await Cart.findOne({ user: touristId }).sort({createdAt : -1});

        if (!cart) {
            cart = new Cart({ user: touristId, products: [] });
        }

        const existingItem = cart.products.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            // Add new item to the cart
            cart.products.push({
                productId,
                productName: product.name,
                quantity,
                price: product.price,
                addedTime: new Date()
            });
        }

        await cart.save();
        return cart;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError("Failed to add item to cart", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Remove an item from the cart
  async removeItemFromCart(touristId, productId) {
    try {
        const cart = await Cart.findOne({ user: touristId }).sort({createdAt : -1});

        if (!cart) {
            throw new ApiError("Cart not found for this user", StatusCodes.NOT_FOUND);
        }

        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            throw new ApiError("Item not found in the cart", StatusCodes.NOT_FOUND);
        }

        cart.products.splice(itemIndex, 1); // Remove the item
        await cart.save();

        return { cart };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError("Failed to remove item from cart", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Change the amount of an item in the cart
  async changeItemQuantity(touristId, productId, newQuantity) {
    try {
        if (newQuantity < 1) {
            throw new ApiError("Quantity must be at least 1", StatusCodes.BAD_REQUEST);
        }

        const cart = await Cart.findOne({ user: touristId }).sort({createdAt : -1});

        if (!cart) {
            throw new ApiError("Cart not found for this user", StatusCodes.NOT_FOUND);
        }

        const item = cart.products.find(item => item.productId.toString() === productId);

        if (!item) {
            throw new ApiError("Item not found in the cart", StatusCodes.NOT_FOUND);
        }

        const product = await Product.findById(productId);

        if (!product || product.isArchived || product.availableQuantity < newQuantity) {
            throw new ApiError("Product is not available in the desired quantity", StatusCodes.BAD_REQUEST);
        }

        item.quantity = newQuantity; // Update the quantity
        await cart.save();

        return { message: "Item quantity updated successfully", cart };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError("Failed to update item quantity", StatusCodes.INTERNAL_SERVER_ERROR);
    }



  }
  async getProductsInMyWishList(touristId){
    let wishList = await WishList.findOne({ user: touristId }).populate({
      path: 'products', // The field to populate
      select: 'name price imageUrl rating availableQuantity', // Fields to include from Product
    });
    if(!wishList){
      wishList = new WishList({ user: touristId, products: [] });
      await wishList.save();

    }
    return wishList.products
  }

  async addProductToMyWishList(touristId,productId){
    const product = Product.findById(productId);

    if (!product) {
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
   }
   let wishList = await WishList.findOne({ user: touristId });
   if(!wishList){
      wishList = new WishList({ user: touristId, products: [] });
    }
    console.log(wishList);
    if (wishList.products.includes(productId)) {
      throw new ApiError("Product already in your wishlist", StatusCodes.BAD_REQUEST);
  }

    // Add product to the wishlist
    wishList.products.push(productId);
    await wishList.save(); // Save the updated wishlist
    wishList = await wishList.populate({
      path: 'products',
      select: 'name price imageUrl rating availableQuantity', // Fields to return from Product
  });

  return wishList.products;
  }

  async removeProductFromMyWishList(touristId,productId){
      const product = await Product.findById(productId);

      if (!product) {
        throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
      }
    let wishList = await WishList.findOne({ user: touristId });

      if(!wishList){
        throw new ApiError("Product not found in your wish list", StatusCodes.NOT_FOUND);
      }
      console.log(wishList)
      const itemIndex = wishList.products.findIndex(item => item.toString() === productId.toString());

      if (itemIndex === -1) {
          throw new ApiError("Product not found in your wish list", StatusCodes.NOT_FOUND);
      }
      wishList.products.splice(itemIndex, 1); // Remove the item
      await wishList.save();
      wishList = await wishList.populate({
        path: 'products',
        select: 'name price imageUrl rating availableQuantity', // Fields to return from Product
    });
      return wishList.products;
  }


  /*
  We will call this method in any instance concerned with decrementing product quantity after a tourist buying it.
  I wrote the line for the person responsible: "await this.checkAndNotifyOutOfStock(product._id);" given that the productID is being passed in the method parameters.
  Just make sure you've imported product.service.js in the file you're working on.
  */
  async checkAndNotifyOutOfStock(productId) {
    try {
      const product = await Product.findById(productId).populate('seller');
      if (!product) {
        throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
      }
  
      if (product.availableQuantity === 0) {

      // Notify the seller
      // const seller = await Seller.findById(product.seller).populate('user', 'email');
      const seller = await Seller.findOne({ user: product.seller }).populate('user', 'email');
      if (seller && seller.user) {
        const emailSubject = 'Product Out of Stock';
        const emailBody = `Dear ${seller.name},\n\nYour product "${product.name}" is out of stock.\n\nPlease restock it as soon as possible.`;
        await sendOutofStockNotification(seller.user.email, emailBody);
        await sendAppNotification(seller.user._id.toString(), { message: `Your product "${product.name}" is out of stock.`, eventId: product._id.toString() });
      }

      // Notify all admins
      const admins = await Admin.find().populate('user', 'email');
      for (const admin of admins) {
        if (admin.user) {
          const emailSubject = 'Product Out of Stock';
          const emailBody = `Dear Admin,\n\nThe product "${product.name}" is out of stock.\n\nPlease take necessary actions.`;
          await sendOutofStockNotification(admin.user.email, emailBody);
          await sendAppNotification(admin.user._id.toString(), { message: `The product "${product.name}" is out of stock.`, eventId: product._id.toString() });
        }
      }
      
      }
    } catch (error) {
      console.error("Error in checkAndNotifyOutOfStock:", error);
      throw error;
    }
  }
}
export default ProductService;