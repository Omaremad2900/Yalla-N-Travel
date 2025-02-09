import Amadeus from "amadeus";
import dotenv from "dotenv";
import Tourist from "../models/tourist.model.js"; // Import the Tourist model
import Stripe from "stripe";
import touristFlightBookingDetails from "../models/flightBookingDetails.model.js";

dotenv.config(); // Load environment variables from .env file

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Step 1: Search for flights
export const searchFlights = async (req, res, next) => {
  try {
    const { originCode, destinationCode, dateOfDeparture, returnDate, max } =
      req.query;
    const userRole = req.user.role; // Extract the user's role from the token

    // Ensure that the user has the 'Tourist' role
    if (userRole !== "Tourist") {
      return res.status(403).json({
        error: "Only users with the Tourist role can perform this action.",
      });
    }
    // Create a params object and only include returnDate if it's provided
    const params = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: "1", // As per business logic
      max: max || "7", // Default to 7 if not provided
    };

    // Only add returnDate if it exists
    if (returnDate) {
      params.returnDate = returnDate;
    }

    const response = await amadeus.shopping.flightOffersSearch.get(params);
    res.status(200).json(response.result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response.body }); // Log the exact error
  }
};

// Step 2: Save the tourist booking data details
export const saveBookingDetails = async (req, res) => {
  try {
    const touristId = req.user.id; // Assuming the JWT contains the user's ID as 'user'
    const userRole = req.user.role; // Extract the user's role from the token
    const travelers = req.body.travelers[0]; // Get travelers data from the request body

    // Ensure that the user has the 'Tourist' role
    if (userRole !== "Tourist") {
      return res.status(403).json({
        error: "Only users with the Tourist role can perform this action.",
      });
    }

    // Validate that travelers array is provided
    if (!travelers || travelers.length === 0) {
      return res
        .status(400)
        .json({ error: "Travelers information is required." });
    }
    //check if already have data use update
    const bookingDetailsExist = await touristFlightBookingDetails.findOne({
      tourist: touristId,
    });
    if (bookingDetailsExist) {
      // Update the existing booking details
      bookingDetailsExist.travelers = travelers;
      await bookingDetailsExist.save();
      return res.status(200).json({
        message: "Booking details updated successfully",
        bookingDetails: bookingDetailsExist,
      });
    }

    // Create a new booking details object
    const bookingDetails = new touristFlightBookingDetails({
      tourist: touristId, // Assign the tourist ID from the JWT
      travelers, // Directly save the travelers array
    });

    // Save the booking details to the database
    await bookingDetails.save();

    // Send a success response with the saved booking details
    return res.status(201).json({
      message: "Booking details saved successfully",
      bookingDetails,
    });
  } catch (error) {
    console.error("Error saving booking details:", error);
    return res.status(500).json({ error: "Failed to save booking details." });
  }
};

// Step 3: Confirm flight
export const confirmFlightPrice = (req, res) => {
  const flight = req.body.data.flightOffers[0];
  const userRole = req.user.role; // Extract the user's role from the token

  // Ensure that the user has the 'Tourist' role
  if (userRole !== "Tourist") {
    return res.status(403).json({
      error: "Only users with the Tourist role can perform this action.",
    });
  }
  // Log or check if flight data is null or undefined
  if (!flight) {
    return res.status(400).json({
      error: "Invalid flight data provided in the request.",
    });
  }

  // Confirm availability and price
  amadeus.shopping.flightOffers.pricing
    .post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    )
    .then(function (response) {
      res.status(200).json(response.result);
    })
    .catch(function (error) {
      console.error("Error confirming flight price:", error);
      res.status(500).json({
        error: error.response?.data || "Error confirming flight price",
      });
    });
};

// Step 4: Book the flight
export const bookFlight = async (req, res) => {
  try {
    const touristId = req.user.id;
    const flightOffers = req.body; // Ensure that flightOffers is structured correctly
    const userRole = req.user.role; // Extract the user's role from the token

    // Ensure that the user has the 'Tourist' role
    if (userRole !== "Tourist") {
      return res.status(403).json({
        error: "Only users with the Tourist role can perform this action.",
      });
    }

    // Fetch booking details of the tourist
    const bookingDetails = await touristFlightBookingDetails.findOne({
      tourist: touristId,
    });

    if (!bookingDetails) {
      return res
        .status(404)
        .json({ error: "Booking details not found for the tourist." });
    }

    // Ensure travelers exist in booking details
    if (!bookingDetails.travelers || bookingDetails.travelers.length === 0) {
      return res
        .status(400)
        .json({ error: "No traveler information available." });
    }


    const data = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffers], // Make sure flightOffers is in the expected structure
        travelers: bookingDetails.travelers.map((traveler, index) => {
          return {
            id: (index + 1).toString(), // Ensure IDs are strings
            dateOfBirth: traveler.dateOfBirth,
            name: {
              firstName: traveler.name.firstName,
              lastName: traveler.name.lastName,
            },
            gender: traveler.gender,
            contact: {
              emailAddress: traveler.contact.emailAddress,
              phones: [traveler.contact.phones[0]], // Ensure phones are structured correctly
            },
            documents: traveler.documents.map((doc) => ({
              documentType: doc.documentType,
              birthPlace: doc.birthPlace,
              issuanceLocation: doc.issuanceLocation,
              issuanceDate: doc.issuanceDate,
              number: doc.number,
              expiryDate: doc.expiryDate,
              issuanceCountry: doc.issuanceCountry,
              validityCountry: doc.validityCountry,
              nationality: doc.nationality,
              holder: doc.holder,
            })),
          };
        }),
      },
    };


    // Book the flight
    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify(data)
    );

    res.status(200).json(response.result);
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({ error: "Failed to book the flight." });
  }
};



// check if booking details is saved 

export const checkIfTouristFlightBookingDetailsSaved = async (req, res) => {
    try {
      // Get the tourist ID from the decoded JWT token
      const touristId = req.user.id; // Assuming you've populated `req.user` after decoding JWT
  
      // Check if there is any booking data for the specified tourist
      const bookingExists = await touristFlightBookingDetails.exists({ tourist: touristId });
  
      if (bookingExists) {
        // If data exists, return true
        return res.status(200).json({ dataExists: true });
      } else {
        // If no data exists, return false
        return res.status(200).json({ dataExists: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // Log the exact error
    }
  };