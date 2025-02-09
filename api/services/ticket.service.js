import Ticket from "../models/ticket.model.js";
import Itinerary from "../models/itinerary.model.js";
import Activity from "../models/activity.model.js";
import Tourist from "../models/tourist.model.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import TransportationTicket from "../models/transportationTicket.js";
import Transportation from "../models/transportation.model.js";

export default class TicketService {
  async createTicketforItinerary(userId, itineraryId) {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      throw new ApiError(`No itinerary with id ${Id}`, StatusCodes.NOT_FOUND);
    }
    //check for availableTickets
    if (itinerary.availableTickets === 0) {
      throw new ApiError(
        `No available tickets for itinerary with id ${Id}`,
        StatusCodes.NOT_FOUND
      );
    }
    // get nationalty of tourist
    const tourist = await Tourist.findOne({ user: userId });
    if (!tourist) {
      throw new ApiError(
        `Tourist with user id ${userId} not found`,
        StatusCodes.NOT_FOUND
      );
    }
    // check if tourist is above 18
    const user = await User.findById(userId);
    const currentDate = new Date();
    const birthDate = new Date(user.date_of_birth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw new ApiError(
        "Tourist must be at least 18 years old to book a ticket",
        StatusCodes.BAD_REQUEST
      );
    }

    const ticket = new Ticket({
      assignee: userId,
      itinerary: itineraryId,
      price: itinerary.price,
    });
    await ticket.save();
    //decrement avaliable tickets
    itinerary.availableTickets -= 1;

    await Itinerary.findByIdAndUpdate(
      itineraryId,
      {
        $push: { tickets: ticket._id },
        availableTickets: itinerary.availableTickets,
      },
      { new: true }
    );
    // update ticket in tourist
    await Tourist.findOneAndUpdate(
      { user: userId },
      { $push: { tickets: ticket._id } },
      { new: true }
    );

    return ticket;
  }
  async createTicketForActivity(userId, activityId) {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      throw new ApiError(`No activity with id ${Id}`, StatusCodes.NOT_FOUND);
    }
    //check for availableTickets
    if (activity.availableTickets === 0) {
      throw new ApiError(
        `No available tickets for activity with id ${Id}`,
        StatusCodes.NOT_FOUND
      );
    }
    //decrement avaliable tickets
    activity.availableTickets -= 1;

    const tourist = await Tourist.findOne({ user: userId });
    if (!tourist) {
      throw new ApiError(
        `Tourist with user id ${userId} not found`,
        StatusCodes.NOT_FOUND
      );
    }
    // check if tourist is above 18
    const user = await User.findById(userId);
    const currentDate = new Date();
    const birthDate = new Date(user.date_of_birth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw new ApiError(
        "Tourist must be at least 18 years old to book a ticket",
        StatusCodes.BAD_REQUEST
      );
    }

    const ticket = new Ticket({
      assignee: userId,
      activity: activityId,
      price: activity.price,
    });
    await ticket.save();
    await Activity.findByIdAndUpdate(
      activityId,
      {
        $push: { tickets: ticket._id },
        availableTickets: activity.availableTickets,
      },
      { new: true }
    );
    // update ticket in tourist
    await Tourist.findOneAndUpdate(
      { user: userId },
      { $push: { tickets: ticket._id } },
      { new: true }
    );
    return ticket;
  }
  async updateTicket(id, updateData) {
    const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!ticket) {
      throw new ApiError(`No ticket with id ${id}`, StatusCodes.NOT_FOUND);
    }
    return ticket;
  }

  async getTicketById(id) {
    return await Ticket.findById(id).populate("assignee itinerary activity");
  }

  async getItinerariesForUser(userId) {
    const tickets = await Ticket.find({ assignee: userId }).populate(
      "itinerary"
    );
    const bookedItineraryIds = tickets.map((ticket) => ticket.itinerary._id);

    // Fetch itineraries that are either active or those deactivated but booked by the user
    const itineraries = await Itinerary.find({
      $or: [
        { status: "active" },
        { _id: { $in: bookedItineraryIds }, status: "deactivated" },
      ],
    });
  }

  async deleteTicketForItinerary(id) {
    // fetch ticket and populate itinerary
    const ticketfordata = await Ticket.findById(id).populate("itinerary");
    if (!ticketfordata) {
      throw new ApiError(`No ticket with id ${id}`, StatusCodes.NOT_FOUND);
    }
    const itinerary=ticketfordata.itinerary
    
    const currentDate = new Date();
    console.log(itinerary)

    // Check if the current date is within 48 hours of the itinerary start date
    const timeDifference = itinerary.start_date - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference < 48) {
      throw new ApiError(
        "Cannot delete ticket less than 48 hours before the itinerary starts",
        StatusCodes.BAD_REQUEST
      );
    }

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      throw new ApiError(`No ticket with id ${id}`, StatusCodes.NOT_FOUND);
    }

    // Increment available tickets and remove the ticket reference from the itinerary
    await Itinerary.findByIdAndUpdate(
      ticket.itinerary,
      {
        $pull: { tickets: ticket._id },
        $inc: { availableTickets: 1 },
      },
      { new: true }
    );

    // Remove the ticket from the tourist's tickets list
    await Tourist.findOneAndUpdate(
      { user: ticket.assignee },
      { $pull: { tickets: ticket._id } },
      { new: true }
    );
    //check if ticket status was PAID decrement loyalty points
    if (ticket.status === "Paid") {
      const tourist = await Tourist.findOne({ user: ticket.assignee });
      if (tourist.level==1) {
        tourist.loyaltyPoints -= ticket.price * 0.5;
      } else if (tourist.level ==2) {
        tourist.loyaltyPoints -= ticket.price * 1;
      } else {
        tourist.loyaltyPoints -= ticket.price * 1.5;
      }
      //if(ticket.paymentType=='wallet')
      tourist.wallet += ticket.price;
      await tourist.save();
    }

    return { message: "Ticket deleted successfully" };
  }

  async deleteTicketforActivity(id) {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new ApiError(`No ticket with id ${id}`, StatusCodes.NOT_FOUND);
    }

    const activity = await Activity.findById(ticket.activity);
    const currentDate = new Date();

    // Check if the current date is within 48 hours of the activity start date
    const timeDifference = activity.dateTime - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference < 48) {
      throw new ApiError(
        "Cannot delete ticket less than 48 hours before the activity starts",
        StatusCodes.BAD_REQUEST
      );
    }

    // Delete the ticket
    await Ticket.findByIdAndDelete(id);

    // Increment available tickets and remove the ticket reference from the activity
    await Activity.findByIdAndUpdate(
      ticket.activity,
      {
        $pull: { tickets: ticket._id },
        $inc: { availableTickets: 1 },
      },
      { new: true }
    );

    // Remove the ticket from the tourist's tickets list
    await Tourist.findOneAndUpdate(
      { user: ticket.assignee },
      { $pull: { tickets: ticket._id } },
      { new: true }
    );
    if (ticket.status === "Paid") {
      console.log("entered")
      const tourist = await Tourist.findOne({ user: ticket.assignee });
      if (tourist.level==1) {
        tourist.loyaltyPoints -= ticket.price * 0.5;
      } else if (tourist.level ==2) {
        tourist.loyaltyPoints -= ticket.price * 1;
      } else {
        tourist.loyaltyPoints -= ticket.price * 1.5;
      }
      //if(ticket.paymentType=='wallet')
      tourist.wallet += ticket.price;
      await tourist.save();
    }

    return { message: "Ticket deleted successfully" };
  }

  // get completed itineraries with proper error handling
  async getCompletedItinerariesByTourist(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
      }

      // Get current date
      const currentDate = new Date();

      // Get total count of tickets that match the query (before pagination)
      const totalTickets = await Ticket.countDocuments({
        assignee: userId,
        itinerary: { $ne: null },
      });
      if (totalTickets === 0) {
        throw new ApiError(
          "No itineraries found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      // Find paginated tickets where the tourist has been assigned and has a non-null itinerary
      const tickets = await Ticket.find({
        assignee: userId,
        itinerary: { $ne: null },
      })
        .populate("itinerary") // Populate to get full itinerary details
        .skip((page - 1) * limit) // Pagination: skip previous pages
        .limit(limit); // Limit: only get 'limit' results

      if (!tickets || tickets.length === 0) {
        throw new ApiError(
          "No itineraries found on this page",
          StatusCodes.NOT_FOUND
        );
      }

      // Filter itineraries where the current date is after the itinerary's end_date
      const completedItineraries = tickets
        .map((ticket) => ticket.itinerary)
        .filter((itinerary) => new Date(itinerary.end_date) < currentDate);
      if (completedItineraries.length === 0) {
        throw new ApiError(
          "No completed itineraries found for this user",
          StatusCodes.NOT_FOUND
        );
      }
      return {
        itineraries: completedItineraries,
        currentPage: page,
        totalItems: totalTickets,
        limit,
        totalPages: Math.ceil(totalTickets / limit),
        hasNext: page < Math.ceil(totalTickets / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Rethrow known ApiErrors
        throw error;
      }
      console.error("Error fetching completed itineraries: ", error);
      throw new ApiError(
        "Could not fetch completed itineraries due to a server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // get completed activities with proper error handling
  async getCompletedActivitiesByTourist(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
      }

      // Get current date
      const currentDate = new Date();

      // Get total count of tickets that match the query (before pagination)
      const totalTickets = await Ticket.countDocuments({
        assignee: userId,
        activity: { $ne: null },
      });
      if (totalTickets === 0) {
        throw new ApiError(
          "No activities found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      // Find paginated tickets where the tourist has been assigned and has a non-null activity
      const tickets = await Ticket.find({
        assignee: userId,
        activity: { $ne: null },
      })
        .populate("activity") // Populate to get full activity details
        .skip((page - 1) * limit) // Pagination: skip previous pages
        .limit(limit); // Limit: only get 'limit' results

      if (!tickets || tickets.length === 0) {
        throw new ApiError(
          "No activities found on this page",
          StatusCodes.NOT_FOUND
        );
      }

      // Filter activities where the current date is after the activity's dateTime
      const completedActivities = tickets
        .map((ticket) => ticket.activity)
        .filter((activity) => new Date(activity.dateTime) < currentDate);

      return {
        activities: completedActivities,
        currentPage: page,
        totalItems: totalTickets,
        limit,
        totalPages: Math.ceil(totalTickets / limit),
        hasNext: page < Math.ceil(totalTickets / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Rethrow known ApiErrors
        throw error;
      }
      console.error("Error fetching completed activities: ", error);
      throw new ApiError(
        "Could not fetch completed activities due to a server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTicketForUsersItinerary(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
      }

      // Get current date
      const currentDate = new Date();
     
      // Get total count of tickets that match the query (before pagination)
      const totalTickets = await Ticket.countDocuments({
        assignee: userId,
        itinerary: { $ne: null },
      });
      if (totalTickets === 0) {
        throw new ApiError(
          "No itineraries found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      // Find paginated tickets where the tourist has been assigned and has a non-null itinerary
      const tickets = await Ticket.find({
        assignee: userId,
        itinerary: { $ne: null },
      })
        .populate("itinerary") // Populate to get full itinerary details
        .skip((page - 1) * limit) // Pagination: skip previous pages
        .limit(limit); // Limit: only get 'limit' results

      if (!tickets || tickets.length === 0) {
        throw new ApiError(
          "No itineraries found on this page",
          StatusCodes.NOT_FOUND
        );
      
      }
      const filteredTickets = tickets.filter(
        (ticket) => new Date(ticket.itinerary.end_date) > currentDate
      );
      if (filteredTickets.length === 0) {
        throw new ApiError(
          "No itineraries found for this user",
          StatusCodes.NOT_FOUND
        );
      }
      
      return {
        tickets: filteredTickets,
        currentPage: page,
        totalItems: totalTickets,
        limit,
        totalPages: Math.ceil(totalTickets / limit),
        hasNext: page < Math.ceil(totalTickets / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Rethrow known ApiErrors
        throw error;
      }
      console.error("Error fetching completed itineraries: ", error);
      throw new ApiError(
        "Could not fetch completed itineraries due to a server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTicketForUsersActivity(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
      }
      const currentDate = new Date();

      // Get total count of tickets that match the query (before pagination)
      const totalTickets = await Ticket.countDocuments({
        assignee: userId,
        activity: { $ne: null },
      });
      if (totalTickets === 0) {
        throw new ApiError(
          "No activities found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      // Find paginated tickets where the tourist has been assigned and has a non-null activity
      const tickets = await Ticket.find({
        assignee: userId,
        activity: { $ne: null },
      })
        .populate("activity") // Populate to get full activity details
        .skip((page - 1) * limit) // Pagination: skip previous pages
        .limit(limit); // Limit: only get 'limit' results

      if (!tickets || tickets.length === 0) {
        throw new ApiError(
          "No activities found on this page",
          StatusCodes.NOT_FOUND
        );
      }
      const filteredTickets = tickets.filter(
        (ticket) => new Date(ticket.activity.dateTime) > currentDate
      );
      if (filteredTickets.length === 0) {
        throw new ApiError(
          "No activities found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      return {
        tickets: filteredTickets,
        currentPage: page,
        totalItems: totalTickets,
        limit,
        totalPages: Math.ceil(totalTickets / limit),
        hasNext: page < Math.ceil(totalTickets / limit),
        hasPrev: page > 1,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Rethrow known ApiErrors
        throw error;
      }
      console.error("Error fetching completed activities: ", error);
      throw new ApiError(
        "Could not fetch completed activities due to a server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
   }
   //get paid tickets for upcoming itineraries
    async getPaidTicketsForUpcomingItineraries(userId, page = 1, limit = 10) {
      try {
        if (!userId) {
          throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
        }
  
        // Get current date
        const currentDate = new Date();
  
        // Get total count of tickets that match the query (before pagination)
        const totalTickets = await Ticket.countDocuments({
          assignee: userId,
          itinerary: { $ne: null },
          status: "Paid",
        });
        if (totalTickets === 0) {
          throw new ApiError(
            "No itineraries found for this user",
            StatusCodes.NOT_FOUND
          );
        }
  
        // Find paginated tickets where the tourist has been assigned and has a non-null itinerary
        const tickets = await Ticket.find({
          assignee: userId,
          itinerary: { $ne: null },
          status: "Paid",
        })
          .populate("itinerary") // Populate to get full itinerary details
          .skip((page - 1) * limit) // Pagination: skip previous pages
          .limit(limit); // Limit: only get 'limit' results
  
        if (!tickets || tickets.length === 0) {
          throw new ApiError(
            "No itineraries found on this page",
            StatusCodes.NOT_FOUND
          );
        }
  
        // Filter itineraries where the current date is before the itinerary's end_date
        const upcomingItineraries = tickets
          .map((ticket) => ticket.itinerary)
          .filter((itinerary) => new Date(itinerary.end_date) > currentDate);
        if (upcomingItineraries.length === 0) {
          throw new ApiError(
            "No upcoming itineraries found for this user",
            StatusCodes.NOT_FOUND
          );
        }
  
        return {
          itineraries: upcomingItineraries,
          currentPage: page,
          totalItems: totalTickets,
          limit,
          totalPages: Math.ceil(totalTickets / limit),
          hasNext: page < Math.ceil(totalTickets / limit),
          hasPrev: page > 1,
        };
      } catch (error) {
        if (error instanceof ApiError) {
          // Rethrow known ApiErrors
          throw error;
        }
        console.error("Error fetching upcoming itineraries: ", error);
        throw new ApiError(
          "Could not fetch upcoming itineraries due to a server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
    //get Paid tickets for upcoming activities
    async getPaidTicketsForUpcomingActivities(userId, page = 1, limit = 10) {
      try {
        if (!userId) {
          throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
        }
  
        // Get current date
        const currentDate = new Date();
  
        // Get total count of tickets that match the query (before pagination)
        const totalTickets = await Ticket.countDocuments({
          assignee: userId,
          activity: { $ne: null },
          status: "Paid",
        });
        console.log(totalTickets);
        if (totalTickets === 0) {
          throw new ApiError(
            "No activities found for this user",
            StatusCodes.NOT_FOUND
          );
        }
  
        // Find paginated tickets where the tourist has been assigned and has a non-null activity
        const tickets = await Ticket.find({
          assignee: userId,
          activity: { $ne: null },
          status: "Paid",
        })
          .populate("activity") // Populate to get full activity details
          .skip((page - 1) * limit) // Pagination: skip previous pages
          .limit(limit); // Limit: only get 'limit' results
  
        if (!tickets || tickets.length === 0) {
          throw new ApiError(
            "No activities found on this page",
            StatusCodes.NOT_FOUND
          );
        }
  
        // Filter activities where the current date is before the activity's dateTime
        const upcomingActivities = tickets
          .map((ticket) => ticket.activity)
          .filter((activity) => new Date(activity.dateTime) > currentDate);
        if (upcomingActivities.length === 0) {
          throw new ApiError(
            "No upcoming activities found for this user",
            StatusCodes.NOT_FOUND
          );
        }
  
        return {
          activities: upcomingActivities,
          currentPage: page,
          totalItems: totalTickets,
          limit,
          totalPages: Math.ceil(totalTickets / limit),
          hasNext: page < Math.ceil(totalTickets / limit),
          hasPrev: page > 1,
        };
      } catch (error) {
        if (error instanceof ApiError) {
          // Rethrow known ApiErrors
          throw error;
        }
        console.error("Error fetching upcoming activities: ", error);
        throw new ApiError(
          "Could not fetch upcoming activities due to a server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
   //Book transportation ticket
    async bookTransportationTicket(userId, transportationId) {
      const transportation = await Transportation.findById(transportationId)
       if (!transportation) {
        throw new ApiError(`No transportation with id ${transportationId}`, StatusCodes.NOT_FOUND);
        }
        // check if id is valid
        if (!userId) {
          throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
        }

        
        //check for availableTickets
        if (transportation.availableSeats === 0) {
          throw new ApiError(
            `No available tickets for transportation with id ${Id}`,
            StatusCodes.NOT_FOUND
          );
        }
        //decrement avaliable seats
        transportation.availableSeats -= 1;
        await transportation.save();
        //create Transporation ticket
        const ticket = new TransportationTicket({
          user: userId,
          transportation: transportationId,
        });
        await ticket.save();
        return ticket;

      }
    //delete transportation ticket
    async deleteTransportationTicket(id) {
      const ticket = await TransportationTicket.findById(id);
      if (!ticket) {
        throw new ApiError(`No ticket with id ${id}`, StatusCodes.NOT_FOUND);
      }
  
      const transportation = await Transportation.findById(ticket.transportation);
      const currentDate = new Date();
  
      // Check if the current date is within 48 hours of the transportation start date
      const timeDifference = transportation.dateTime - currentDate;
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
  
      if (hoursDifference < 48) {
        throw new ApiError(
          "Cannot delete ticket less than 48 hours before the transportation starts",
          StatusCodes.BAD_REQUEST
        );
      }
  
      // Delete the ticket
      await TransportationTicket.findByIdAndDelete(id);
  
      // Increment available tickets and remove the ticket reference from the transportation
      await Transportation.findByIdAndUpdate(
        ticket.transportation,
        {
          $inc: { availableSeats: 1 },
        },
        { new: true }
      );
  
      return { message: "Ticket deleted successfully" };
    }
    // get all transportation Tickets for user
    async getTransportationTicketForUser(userId, page = 1, limit = 10) {
      try {
        if (!userId) {
          throw new ApiError("User ID is required", StatusCodes.BAD_REQUEST);
        }
  
        // Get total count of tickets that match the query (before pagination)
        const totalTickets = await TransportationTicket.countDocuments({
          user: userId,
          transportation: { $ne: null },
        });
        if (totalTickets === 0) {
          throw new ApiError(
            "No transportation found for this user",
            StatusCodes.NOT_FOUND
          );
        }
  
        // Find paginated tickets where the tourist has been assigned and has a non-null transportation
        const tickets = await TransportationTicket.find({
          user: userId,
          transportation: { $ne: null },
        })
          .populate("transportation") // Populate to get full transportation details
          .skip((page - 1) * limit) // Pagination: skip previous pages
          .limit(limit); // Limit: only get 'limit' results
  
        if (!tickets || tickets.length === 0) {
          throw new ApiError(
            "No transportation found on this page",
            StatusCodes.NOT_FOUND
          );
        }
  
        return {
          tickets: tickets,
          currentPage: page,
          totalItems: totalTickets,
          limit,
          totalPages: Math.ceil(totalTickets / limit),
          hasNext: page < Math.ceil(totalTickets / limit),
          hasPrev: page > 1,
        };
      } catch (error) {
        if (error instanceof ApiError) {
          // Rethrow known ApiErrors
          throw error;
        }
        console.error("Error fetching completed activities: ", error);
        throw new ApiError(
          "Could not fetch completed activities due to a server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
}

