// hotelBooking.controller.js
import Amadeus from "amadeus";
import dotenv from "dotenv";
import hotelBookingDetailsModel from "../models/hotelBookingDetails.model.js";

dotenv.config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});


// Step 1: search hotels in a city with filters
export const searchHotelsInCity = async (req, res) => {
    try {
      const { cityCode, radius, amenities, ratings } = req.query;
  
      const userRole = req.user.role;
  
      // Ensure that the user has the 'Tourist' role
      if (userRole !== "Tourist") {
        return res.status(403).json({
          error: "Only users with the Tourist role can perform this action.",
        });
      }
  
      // Ensure cityCode (IATA code) is provided
      if (!cityCode) {
        return res.status(400).json({ error: "City code (IATA) is required." });
      }
  
      // Prepare parameters for hotel search
      const params = {
        cityCode,
        radius: radius || 5, // Default to 5 km if radius is not provided
      };
  
      // Convert amenities and ratings to comma-separated strings if provided
      if (amenities) {
        params.amenities = Array.isArray(amenities) ? amenities.join(',') : amenities;
      }
  
      if (ratings) {
        params.ratings = Array.isArray(ratings) ? ratings.join(',') : ratings;
      }
  
      // Fetch hotels with filters
      const hotelsResponse = await amadeus.referenceData.locations.hotels.byCity.get(params);
  
      res.status(200).json(hotelsResponse.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ error: error.response?.body || error.message });
    }
  };

// Step 2: get multiple hotel offers
export const getMultipleHotelOffers = async (req, res) => {
    try {
      const {
        hotelIds,
        adults,
        checkInDate,
        checkOutDate,
        roomQuantity,

      } = req.query;
  
      const userRole = req.user.role; // Extract the user's role from the token
  
      // Ensure that the user has the 'Tourist' role
      if (userRole !== "Tourist") {
        return res.status(403).json({
          error: "Only users with the Tourist role can perform this action.",
        });
      }
  
      // Validate hotelIds
      if (!hotelIds) {
        return res.status(400).json({ error: "hotelIds is required." });
      }
  
      // Prepare parameters for hotel offers search
      const params = {
        hotelIds: Array.isArray(hotelIds) ? hotelIds.join(',') : hotelIds, // Expecting hotelIds as a comma-separated list
        adults: adults || 1, // Default to 1 if not provided
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomQuantity : roomQuantity,
      };
  
      // Step 3: Fetch hotel offers
      const hotelOffersResponse = await amadeus.shopping.hotelOffersSearch.get(params);
  
      res.status(200).json(hotelOffersResponse.data);
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      res.status(500).json({ error: error.response?.body || error.message });
    }
  };




  export const createHotelOrder = async (req, res) => {
    try {
        const userRole = req.user.role;
        
        if (userRole !== "Tourist") {
            return res.status(403).json({
                error: "Only users with the Tourist role can perform this action.",
            });
        }
        // Set current date as check-in and next day as check-out
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 1);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 1);

        const formattedCheckInDate = checkInDate.toISOString().split('T')[0];
        const formattedCheckOutDate = checkOutDate.toISOString().split('T')[0];
        
        // Mocking a hardcoded response for testing purposes
        const isTestMode = true; // Set this flag dynamically if needed
        if (isTestMode) {
            const mockedResponse = {
                data: {
                    type: "hotel-order",
                    id: "V0g2VFJaLzIwMjQtMDYtMDc=",
                    hotelBookings: [
                        {
                            type: "hotel-booking",
                            id: "MS84OTkyMjcxMC85MDIyNDU0OQ==",
                            bookingStatus: "CONFIRMED",
                            hotelProviderInformation: [
                                {
                                    hotelProviderCode: "AR",
                                    confirmationNumber: "89922710",
                                },
                            ],
                            roomAssociations: [
                                {
                                    hotelOfferId: req.body.data.roomAssociations[0].hotelOfferId || "SAMPLE_OFFER_ID",
                                    guestReferences: req.body.data.guests.map(guest => ({
                                        guestReference: guest.tid.toString(),
                                    })),
                                },
                            ],
                            hotelOffer: {
                                id: req.body.data.roomAssociations[0].hotelOfferId || "SAMPLE_OFFER_ID",
                                type: "hotel-offer",
                                checkInDate: formattedCheckInDate || "2025-02-07",
                                checkOutDate: formattedCheckOutDate || "2025-02-12",
                                guests: { adults: 1 },
                                price: {
                                    base: "195.50",
                                    currency: "EUR",
                                    total: "215.05",
                                },
                                room: {
                                    description: { text: "Sample Room Description" },
                                    type: "XMI",
                                },
                            },
                            hotel: {
                                hotelId: "ARMADAIT",
                                chainCode: "AR",
                                name: "AC BY MARRIOTT HOTEL AITANA",
                            },
                            payment: {
                                method: "CREDIT_CARD",
                                paymentCard: {
                                    paymentCardInfo: {
                                        vendorCode: req.body.data.payment.paymentCard.paymentCardInfo.vendorCode || "VI",
                                        cardNumber: "415128XXXXXX1370",
                                        expiryDate: req.body.data.payment.paymentCard.paymentCardInfo.expiryDate || "0826",
                                        holderName: req.body.data.payment.paymentCard.paymentCardInfo.holderName || "BOB SMITH",
                                    },
                                },
                            },
                        },
                    ],
                    guests: req.body.data.guests.map(guest => ({
                        tid: guest.tid,
                        id: guest.tid,
                        title: guest.title,
                        firstName: guest.firstName,
                        lastName: guest.lastName,
                        phone: guest.phone,
                        email: guest.email,
                    })),
                },
            };

            return res.status(201).json(mockedResponse);
        }

        // If not in test mode, call the Amadeus API as usual
        // const response = await amadeus.booking.hotelBookings.post(JSON.stringify(req.body));
        // res.status(201).json(response.data);

    } catch (error) {
        console.error("Error creating hotel order:", error);
        res.status(500).json({ error: error.response?.body || error.message });
    }
};