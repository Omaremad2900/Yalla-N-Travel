import Tourist from '../models/tourist.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import Address from '../models/address.model.js'; // Make sure this path is correct

class AddressService {

   async addAddress(touristId, addressData) {
    try {
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            throw new ApiError('Tourist not found', StatusCodes.NOT_FOUND);
        }

        if (!tourist.addresses) {
            tourist.addresses = [];
        }

        const address = new Address({ ...addressData, tourist_id: tourist._id });
        await address.save();

        tourist.addresses.push(address._id);
        await tourist.save();
        return address;
    } catch (error) {
        console.error("Error during adding address:", error);
        throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
    }
}

    async updateAddress(addressId, addressData) {
    try {
        const address = await Address.findById(addressId);
        if (!address) {
            throw new ApiError('Address not found', StatusCodes.NOT_FOUND);
        }

        Object.assign(address, addressData);
        await address.save();
        return address;
    } catch (error) {
        throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
    }
    }

    async deleteAddress(addressId) {
        try {
            const address = await Address.findById(addressId);
            if (!address) {
                throw new ApiError('Address not found', StatusCodes.NOT_FOUND);
            }

            await Address.deleteOne({ _id: addressId }); 

            return { message: "Address successfully deleted" }; // Optionally return a success message
        } catch (error) {
            console.error('Delete Address Error:', error);
            throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
        }
    }

    async getMyAddresses(touristId) {
        try {
            const tourist = await Tourist.findById(touristId).populate('addresses');
            if (!tourist) {
                throw new ApiError('Tourist not found', StatusCodes.NOT_FOUND);
            }
            return tourist.addresses;
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
        }
    }

    async setDefault(touristId, addressId) {
    try {

        const address = await Address.findById(addressId);
        if (!address) {
            throw new ApiError('Address not found', StatusCodes.NOT_FOUND);
        }

        if (address.tourist_id.toString() !== touristId.toString()) {
            throw new ApiError('Unauthorized to modify this address', StatusCodes.UNAUTHORIZED);
        }

        await Address.updateMany(
            { tourist_id: touristId },
            { $set: { defaultAddress: false } }
        );
        
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { $set: { defaultAddress: true } },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            console.error(`No address found with ID: ${addressId}`);
            throw new ApiError('Address not found', StatusCodes.NOT_FOUND);
        }

        return { message: "Default address updated successfully", updatedAddress };
    } catch (error) {
        console.error('Error setting default address:', error);
        throw new ApiError("Unable to set default address", StatusCodes.BAD_REQUEST);
    }
    }

}


export default AddressService;
