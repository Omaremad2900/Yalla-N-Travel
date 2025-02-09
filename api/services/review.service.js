import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
class ReviewService {
    async updateProductRating(productId) {
        try {
            const reviews = await Review.find({ entityId: productId, entityType: 'Product' });
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            await Product.findByIdAndUpdate(productId, { rating: averageRating });
            // console.log(averageRating)
            return averageRating;
        } catch (error) {
            throw new ApiError("Failed to update product rating: " + error.message,StatusCodes.BAD_REQUEST);
        }
    }

    async createReview(entityType, entityId, touristId, rating, comment) {
        try {
            // Check if the user has an order for the specified product
            const hasPurchased = await Order.didTouristBuyProduct(touristId, entityId);

            if (!hasPurchased) {
                // Use apiError to throw a 403 Forbidden error
                throw new ApiError("You can only review products you have purchased.", StatusCodes.BAD_REQUEST);
            }


            // Proceed with creating the review if the user has purchased the product
            const reviewData = { entityType, entityId, user:touristId, rating };
            if (comment) {
                reviewData.comment = comment;
            }

            const review = new Review(reviewData);
            await review.save();

            // Update the product to include this review and update the rating
            // if (entityType === 'Product') {
                await Product.findByIdAndUpdate(entityId, { $push: { reviews: review._id } });
                const averageRating=await this.updateProductRating(entityId);
            // }
            //et newAvgRating=
            // console.log(averageRating)
            return averageRating;
        } catch (error) {
            // Pass the error to the error middleware
            throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
        }
    }

    async getAllUserReviews(entityType, touristId) {
        try {
            return await Review.find({ entityType, user:touristId });
        } catch (error) {
            throw new ApiError("Failed to get user reviews: " + error.message,StatusCodes.BAD_REQUEST);
        }
    }
    // get all reviews for entity
    async getAllReviews(entityType, entityId) {
        try {
            return await Review.find({ entityType, entityId });
        } catch (error) {
            throw new ApiError("Failed to get reviews: " + error.message,StatusCodes.BAD_REQUEST);
        }
    }

}

export default ReviewService;
