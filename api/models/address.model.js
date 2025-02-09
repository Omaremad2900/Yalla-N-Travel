import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const addressSchema = new mongoose.Schema({
    tourist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tourist",
        required: true,
    },
    street: {
        type: String,
        required: [true, "Street is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    zipCode: {
        type: String,
        required: [true, "Zip Code is required"],
    },
    defaultAddress: {
        type: Boolean,
        default: false,
    }
    },   
    { timestamps: true }
);

addressSchema.plugin(mongoosePaginate);
export { addressSchema };
export default mongoose.model('Address', addressSchema);
