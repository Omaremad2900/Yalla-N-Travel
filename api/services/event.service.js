import Activity from "../models/activity.model.js";
import Itinerary from "../models/itinerary.model.js";
import ApiError from '../utils/apiError.js'; 
import { StatusCodes } from 'http-status-codes';

class EventService {
    async addInterest(userId, itemId, type) {
        const EventModel = type === 'activity' ? Activity : Itinerary;
        const event = await EventModel.findById(itemId);
        if (!event) {
            throw new ApiError('Event not found', StatusCodes.NOT_FOUND);
        }
        if (!event.interestedUsers.includes(userId)) {
            event.interestedUsers.push(userId);
            await event.save();
        }
        else{
            throw new ApiError('User already added as interested', StatusCodes.BAD_REQUEST);
        }
        return event;
    }

    async removeInterest(userId, itemtId, type) {
        const EventModel = type === 'activity' ? Activity : Itinerary;
        const event = await EventModel.findById(itemtId);
        if (!event) {
            throw new ApiError('Event not found', StatusCodes.NOT_FOUND);
        }
        event.interestedUsers.pull(userId);
        await event.save();
        return event;
    }
}
export default EventService;