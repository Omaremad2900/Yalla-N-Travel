//crud transportation
import Transportation from "../models/transportation.model.js";
import ApiError from "../utils/apiError.js";

class transportationService{
    async createTransportation(id,transportation){
        try {

            const newTransportation = new Transportation({...transportation, advertiser: id});
            await newTransportation.save();
            return newTransportation;
        } catch (error) {
            throw new ApiError(error.message, 400);
        }
    }
    //paginate
    async getTransportation(page, limit){
        const skip = (page - 1) * limit;
        try {
            const transportations = await Transportation.find().skip(skip).limit(limit);
            return transportations;
        } catch (error) {
            throw new ApiError(error.message, 400);
        }
    }
    async getTransportationById(transportationId){
        try {
            const transportation = await Transportation.findById(transportationId);
            return transportation;
        } catch (error) {
            throw new ApiError(error.message, 400);
        }
    }
    async updateTransportation(transportationId, transportation){
        try {
            const updatedTransportation = await Transportation.findByIdAndUpdate(transportationId, transportation, {new: true});
            return updatedTransportation;
        } catch (error) {
            throw new ApiError(error.message, 400);
        }
    }
    async deleteTransportation(transportationId){
        try {
            await Transportation.findByIdAndDelete(transportationId);
            return {message: "Transportation deleted successfully"};
        } catch (error) {
            throw new ApiError(error.message, 400);
        }
    }
}
export default transportationService;