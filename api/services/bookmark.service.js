import Tourist from '../models/tourist.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import Activity from '../models/activity.model.js';
import Itinerary from '../models/itinerary.model.js';

class BookmarkService {
    async addBookmark(touristId, itemId, type) {
        try {
            const tourist = await Tourist.findById(touristId);
            if (!tourist) {
                throw new ApiError('Tourist not found', StatusCodes.NOT_FOUND);
            }

            let item;
            if (type === 'activity') {
                item = await Activity.findById(itemId);
                if (!item) {
                    throw new ApiError('Activity not found', StatusCodes.NOT_FOUND);
                }
                if (!tourist.savedActivities.includes(item._id)) {
                    tourist.savedActivities.push(item._id);
                } else {
                    throw new ApiError('Activity already bookmarked', StatusCodes.BAD_REQUEST);
                }
            } else if (type === 'itinerary') {
                item = await Itinerary.findById(itemId);
                if (!item) {
                    throw new ApiError('Itinerary not found', StatusCodes.NOT_FOUND);
                }
                if (!tourist.savedItineraries.includes(item._id)) {
                    tourist.savedItineraries.push(item._id);
                } else {
                    throw new ApiError('Itinerary already bookmarked', StatusCodes.BAD_REQUEST);
                }
            } else {
                throw new ApiError('Invalid bookmark type', StatusCodes.BAD_REQUEST);
            }

            await tourist.save();
            return { message: `${type} bookmarked successfully`, item };
        } catch (error) {
            console.error(`Error during adding ${type} bookmark:`, error);
            throw new ApiError(error.message, error.statusCode || StatusCodes.BAD_REQUEST);
        }
    }

    async getMyBookmarks(touristId) {
        const tourist = await Tourist.findById(touristId)
            .populate('savedActivities')
            .populate('savedItineraries');
        if (!tourist) {
            throw new ApiError('Tourist not found', StatusCodes.NOT_FOUND);
        }
        return {
            activities: tourist.savedActivities,
            itineraries: tourist.savedItineraries
        };
    }

    async removeBookmark(touristId, itemId, type) {
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            throw new ApiError('Tourist not found', StatusCodes.NOT_FOUND);
        }
        if (type === 'activity' && tourist.savedActivities.includes(itemId)) {
            tourist.savedActivities.pull(itemId);
        } else if (type === 'itinerary' && tourist.savedItineraries.includes(itemId)) {
            tourist.savedItineraries.pull(itemId);
        } else {
            // Throw an error if the item is not found in the respective array
            throw new ApiError('Item not found in bookmarks', StatusCodes.NOT_FOUND);
        }

        await tourist.save();
        return { message: "Item removed from bookmarks successfully" };
    }
}


export default BookmarkService;
