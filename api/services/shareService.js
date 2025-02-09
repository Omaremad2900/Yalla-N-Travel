import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import config from '../config/config.js';  
import {scheduleShareableEmail} from '../utils/Jobs/agenda.js'
import Activity from '../models/activity.model.js';
import Museum from '../models/museum.model.js';
import HistoricalPlace from '../models/historicalPlace.model.js';
import Itinerary from '../models/itinerary.model.js';

class ShareService {
  async shareResource(req) {
    const { resourceType, resourceId, email } = req.body;

    const validResourceTypes = ['activity', 'museum', 'historicalPlace', 'itinerary'];
    if (!validResourceTypes.includes(resourceType)) {
      throw new ApiError('Invalid resource type', StatusCodes.BAD_REQUEST);
    }

    let resourceExists;
    switch (resourceType) {
      case 'activity':
        resourceExists = await Activity.findById(resourceId);
        break;
      case 'museum':
        resourceExists = await Museum.findById(resourceId);
        break;
      case 'historicalPlace':
        resourceExists = await HistoricalPlace.findById(resourceId);
        break;
      case 'itinerary':
        resourceExists = await Itinerary.findById(resourceId);
        break;
      default:
        throw new ApiError('Invalid resource type', StatusCodes.BAD_REQUEST);
    }

    console.log("correct resource");

    if (!resourceExists) {
      throw new ApiError(`${resourceType} not found`, StatusCodes.NOT_FOUND);
    }

    console.log('BASE_URL:', config.BASE_URL);  // Debugging line

    const shareableLink = `${config.BASE_URL}/${resourceType}/${resourceId}`;

    console.log("link generated");
    
    if (email) {
      await scheduleShareableEmail(email,resourceType,shareableLink)
    }

    return { shareableLink };
  }
}

export default ShareService;
