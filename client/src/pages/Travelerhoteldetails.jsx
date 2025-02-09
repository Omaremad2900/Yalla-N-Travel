import React, { useState } from 'react';

const Travelerhoteldetails = ({ bookingService }) => {
    const [bookingDetails, setBookingDetails] = useState({
        type: "hotel-order",
        guests: [
            {
                tid: 1,
                title: "MR",
                firstName: "BOB",
                lastName: "SMITH",
                phone: "+33679278416",
                email: "bob.smith@email.com"
            }
        ],
        travelAgent: {
            contact: {
                email: "bob.smith@email.com"
            }
        },
        roomAssociations: [
            {
                guestReferences: [
                    {
                        guestReference: "1"
                    }
                ],
                hotelOfferId: "1GFNIWJQE5"
            }
        ],
        payment: {
            method: "CREDIT_CARD",
            paymentCard: {
                paymentCardInfo: {
                    vendorCode: "VI",
                    cardNumber: "4151289722471370",
                    expiryDate: "2026-08",
                    holderName: "BOB SMITH"
                }
            }
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await bookingService.saveHotelBookingDetails(bookingDetails);
            console.log('Booking saved:', response);
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Traveler Hotel Booking Details</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Guest Information */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Guest Title:</label>
                    <input
                        type="text"
                        name="guests[0].title"
                        value={bookingDetails.guests[0].title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Guest First Name:</label>
                    <input
                        type="text"
                        name="guests[0].firstName"
                        value={bookingDetails.guests[0].firstName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Guest Last Name:</label>
                    <input
                        type="text"
                        name="guests[0].lastName"
                        value={bookingDetails.guests[0].lastName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        name="guests[0].phone"
                        value={bookingDetails.guests[0].phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="guests[0].email"
                        value={bookingDetails.guests[0].email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* Travel Agent Information */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Travel Agent Email:</label>
                    <input
                        type="email"
                        name="travelAgent.contact.email"
                        value={bookingDetails.travelAgent.contact.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* Room Association */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Guest Reference:</label>
                    <input
                        type="text"
                        name="roomAssociations[0].guestReferences[0].guestReference"
                        value={bookingDetails.roomAssociations[0].guestReferences[0].guestReference}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Hotel Offer ID:</label>
                    <input
                        type="text"
                        name="roomAssociations[0].hotelOfferId"
                        value={bookingDetails.roomAssociations[0].hotelOfferId}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* Payment Information */}
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Payment Method:</label>
                    <input
                        type="text"
                        name="payment.method"
                        value={bookingDetails.payment.method}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Card Vendor Code:</label>
                    <input
                        type="text"
                        name="payment.paymentCard.paymentCardInfo.vendorCode"
                        value={bookingDetails.payment.paymentCard.paymentCardInfo.vendorCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Card Number:</label>
                    <input
                        type="text"
                        name="payment.paymentCard.paymentCardInfo.cardNumber"
                        value={bookingDetails.payment.paymentCard.paymentCardInfo.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700"
                    >
                        Submit Booking
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Travelerhoteldetails;
