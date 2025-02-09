import Museum from '../models/museum.model.js';

class MuseumService {
  async createMuseum(data) {
    const museum = new Museum(data);
    return await museum.save();
  }

  async getMuseum(id) {
    return await Museum.findById(id);
  }

  async updateMuseum(id, data) {
    return await Museum.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteMuseum(id) {
    return await Museum.findByIdAndDelete(id);
  }

  async getAllMuseums(id,page,limit) {
    const options = {
      page: page,
      limit: limit,
    };
    return await Museum.find({tourismGovernor: id}).paginate({}, options);
  }
}

export default MuseumService;