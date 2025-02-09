import HistoricalPlace from '../models/historicalPlace.model.js';

class HistoricalPlaceService {
  async createHistoricalPlace(data) {
    const historicalPlace = new HistoricalPlace(data);
    return await historicalPlace.save();
  }

  async getHistoricalPlace(id) {
    return await HistoricalPlace.findById(id);
  }

  async updateHistoricalPlace(id, data) {
    return await HistoricalPlace.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteHistoricalPlace(id) {
    return await HistoricalPlace.findByIdAndDelete(id);
  }

  async getAllHistoricalPlaces(id,page,limit) {
    const options = {
      page: page,
      limit: limit,
    };
    return await HistoricalPlace.find({tourismGovernor: id}).paginate({}, options);
  }
}

export default HistoricalPlaceService;