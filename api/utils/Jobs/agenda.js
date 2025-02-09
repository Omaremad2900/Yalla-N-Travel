import Agenda from 'agenda';
import config from '../../config/config.js';
import { sendAcceptanceEmail, sendPaymentConfirmationEmail, sendAppNotification, sendEmailNotification } from './mailer.js';
import { sendShareableLink } from './mailer.js';
import Advertiser from '../../models/advertiser.model.js';
import Activity from '../../models/activity.model.js';
import Itinerary from '../../models/itinerary.model.js';
import mongoose from 'mongoose';
import Ticket from '../../models/ticket.model.js';
import Tourist from '../../models/tourist.model.js';
import PromoCode from '../../models/promoCode.model.js';



const agenda = new Agenda({
  db: { address: config.databaseURL, collection: config.agenda.dbCollection },
  processEvery: config.agenda.pooltime,
  maxConcurrency: config.agenda.concurrency,
});

// Define the "send-acceptance-email" job
agenda.define('send-acceptance-email', async (job) => {
  const { email, username } = job.attrs.data;

  try {
    await sendAcceptanceEmail(
      email,
      'User Accepted',
      `Hello ${username},\n\nYour account has been accepted by the admin.`
    );
    console.log(`Acceptance email sent to ${email}`);
  } catch (err) {
    console.error('Error sending acceptance email:', err);
  }
});

// define the"confirm-payment-email' job
agenda.define('confirm-payment-email', async (job) => {
  const { email, username, totalPrice } = job.attrs.data;

  try {
    await sendPaymentConfirmationEmail(
      email,
      'Payment Confirmed',
      `Hello ${username},\n\nWe are happy to confirm that your payment for has been successfully processed. Below are the details of your payment:\n total price ${totalPrice}`
    );
    console.log(`Payment confirmation email sent to ${email}`);
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
  }
});

agenda.define('send-shareable-link', async (job) => {
  const { email, resourceType, link } = job.attrs.data;

  try {
    await sendShareableLink(
      'Yalla nTravel<ismaielnagaty@live.com>',
      email,
      `Shareable Link for ${resourceType}`,
      link,
      `Here is the shareable link for the ${resourceType}: ${link}`);
    console.log(`Shareable link sent to ${email}`);
  } catch (err) {
    console.error('Error sending shareable link:', err);
  }

});

// Send app notifications
agenda.define('send app notifications', { concurrency: 10 },async () => {
  const now = new Date();
  var utc = now.getTime() + (now.getTimezoneOffset() * -60000);
  const next24Hours = new Date(utc + 24 * 60 * 60 * 1000);

  console.log('SENDING NOTIFICATIONS');

  // Fetch tickets with populated itinerary or activity
  const tickets = await Ticket.aggregate([
    {
      $lookup: {
        from: 'itineraries',
        localField: 'itinerary',
        foreignField: '_id',
        as: 'itinerary',
      },
    },
    {
      $lookup: {
        from: 'activities',
        localField: 'activity',
        foreignField: '_id',
        as: 'activity',
      },
    },
    {
      $unwind: { path: '$itinerary', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$activity', preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        $or: [
          { 'itinerary.start_date': { $gte: now, $lte: next24Hours } },
          { 'activity.dateTime': { $gte: now, $lte: next24Hours } },
        ],
      },
    },
  ]);
  for (const ticket of tickets) {
    const startDate = ticket.itinerary?.start_date || ticket.activity?.dateTime;
    if (startDate && new Date(startDate) >= now && new Date(startDate) <= next24Hours) {
      // Send notification to the assignee
      console.log(ticket._id)
      if (ticket.assignee) {
        sendAppNotification(ticket.assignee.toString(), {
          message: `Reminder: Your event associated with ticket "${ticket._id}" is tomorrow!`,
          ticketId: ticket._id,
        });
      }
    }
  }
});

// Define the "send-flagged-notification" job
agenda.define('send-flagged-notification', async (job) => {
  const { itineraryId, activityId } = job.attrs.data;

  try {
    let message = '';
    let user = null;

    // Check if itinerary is flagged
    if (itineraryId) {
      const itinerary = await Itinerary.findById(itineraryId).populate('tourGuideId');
      if (!itinerary) {
        console.error('Itinerary not found');
      }
      if (itinerary.isFlagged) {
        message = `Itinerary "${itinerary.title}" has been flagged.`;
        user = itinerary.tourGuideId; // Ensure tourGuideId is populated
        console.log(`Itinerary user:`, user);
      }
    }

    // Check if activity is flagged
    if (activityId) {
      const activity = await Activity.findById(activityId);
      const advertiser = await Advertiser.findOne({user_id: activity.advertiser_id}).populate({
        path: 'user_id',
        select: 'email username', // Fetch only the fields you need
      });;
      //const user = advertiser.user_id;
      console.log(`Activity: ${activity}`);
      if (!activity) {
        console.error('Activity not found');
        return;
      }

      // Corrected flag check
      if (activity.isFlagged) {
        message = `Activity "${activity.name}" has been flagged.`;
        user = advertiser.user_id; // Ensure advertiser_id is populated
        console.log(`Activity user:`, user);
      }
    }

    if (user) {
      // Send app notification to the user
      const appMessage = { message, eventId: itineraryId || activityId };
      await sendAppNotification(user._id.toString(), appMessage); // Ensure proper notification function
      console.log(`App notification sent to user ${user._id}`);
    } else {
      console.error('User not found for notification');
    }
  } catch (err) {
    console.error('Error sending flagged notification:', err);
  }
});

// Send email notifications
agenda.define('send email notifications', { concurrency: 10 },async () => {
  const now = new Date();
  var utc = now.getTime() + (now.getTimezoneOffset() * -60000);
  const next24Hours = new Date(utc + 24 * 60 * 60 * 1000);
  console.log('SENDING EMAILS');


  // Fetch tickets with populated itinerary or activity
  const tickets = await Ticket.aggregate([
    // Lookup for itinerary
    {
      $lookup: {
        from: 'itineraries', // Collection name for the itinerary
        localField: 'itinerary',
        foreignField: '_id',
        as: 'itinerary',
      },
    },
    // Lookup for activity
    {
      $lookup: {
        from: 'activities', // Collection name for the activity
        localField: 'activity',
        foreignField: '_id',
        as: 'activity',
      },
    },
    // Lookup for assignee
    {
      $lookup: {
        from: 'users', // Collection name for the assignee
        localField: 'assignee',
        foreignField: '_id',
        as: 'assignee',
      },
    },
    // Unwind itinerary, activity, and assignee arrays
    {
      $unwind: { path: '$itinerary', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$activity', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true },
    },
    // Match tickets within the next 24 hours
    {
      $match: {
        $or: [
          { 'itinerary.start_date': { $gte: now, $lte: next24Hours } },
          { 'activity.dateTime': { $gte: now, $lte: next24Hours } },
        ],
      },
    },
    // Project the needed fields
    {
      $project: {
        _id: 1,
        itinerary: {
          title: 1,
          start_date: 1,
        },
        activity: {
          name: 1,
          dateTime: 1,
        },
        assignee: {
          email: 1,
        },
      },
    },
  ]);
  for (const ticket of tickets) {
    // Determine the relevant start date (from itinerary or activity)
    const startDate = ticket.itinerary?.start_date || ticket.activity?.dateTime;

    // If the event is within the next 24 hours
    if (startDate && new Date(startDate) >= now && new Date(startDate) <= next24Hours) {
      // Send email to the assignee
      if (ticket.assignee?.email) {
        await sendEmailNotification(ticket.assignee.email, {
          name: ticket.itinerary?.title || ticket.activity?.name || 'Your event',
          startTime: startDate,
        });
      }
    }
  }
});

// Define birthday promo codes to tourists Job
agenda.define('send-birthday-promo', async () => {
  console.log('Sending birthday promo codes to tourists...');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  try {
    const tourists = await Tourist.find()
      .populate('user', 'email date_of_birth username')
      .exec();

    for (const tourist of tourists) {
      const user = tourist.user;
      if (user && user.date_of_birth) {
        const dob = new Date(user.date_of_birth);
        if (dob.getMonth() === currentMonth && dob.getDate() === currentDay) {
          const promoCodeName = `BDAY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          const expirationDate = new Date(today);
          expirationDate.setMonth(today.getMonth() + 1);

          const promoCode = new PromoCode({
            name: promoCodeName,
            discountMultiplier: 0.9, // I set the discount to 10%
            expirationDate: expirationDate,
          });
          await promoCode.save();

          const emailSubject = '🎉 Happy Birthday from Yalla nTravel! 🎉';
          const emailBody = `Dear ${user.username},\n\nHappy Birthday! 🥳\n\nTo celebrate your special day, we're giving you an exclusive 10% discount promo code:\n\n🎁 **${promoCodeName}** 🎁\n\nUse this code at checkout. Hurry, this code is valid until ${expirationDate.toDateString()}.\n\nThank you for being part of Yalla nTravel!\n\nBest wishes,\nThe Yalla nTravel Team`;

          await sendAcceptanceEmail(user.email, emailSubject, emailBody);
          console.log(`SENDING BIRTHDAY EMAILS`);

          // Send system notification
          const notificationMessage = `Happy Birthday! 🎉 Use promo code ${promoCodeName} for a 10% discount.`;
          await sendAppNotification(user._id.toString(), { message: notificationMessage });
          console.log(`SENDING BIRTHDAY NOTIFICATION`);
        }
      }
    }
  } catch (err) {
    console.error('Error sending birthday promo emails:', err);
  }
});

agenda.define('notify-open-bookings', async () => {
  const activities = await Activity.find({ isBookingOpen: true});
  const itineraries = await Itinerary.find({ accessible: true});

  // Loop through all events that have opened bookings
  for (const event of [...activities, ...itineraries]) {
      const eventType = event instanceof Activity ? 'activity' : 'itinerary';
      
      // Notify each interested user
      for (const userId of event.interestedUsers) {
          const message = `Bookings are now open for ${eventType}: ${event.name || event.title}`;
          await sendAppNotification(userId.toString(), {
              message: message,
              eventId: event._id.toString()
          });
      }

      await event.save();
  }
});


//--------------------------------------------------------Initialize Agenda and start it----------------------------------------------------
export const initAgenda = async () => {
  await agenda.start();

  console.log('Agenda started!');
  return agenda;
};
//------------------------------------------------------------------------------------------------------------------------------------------

// Function to schedule the "send-acceptance-email" job
export const scheduleAcceptanceEmail = async (email, username) => {
  await agenda.now('send-acceptance-email', { email, username });
  console.log(`Job scheduled to send acceptance email to ${email}`);
};

// Function to schedule the "confirm-payment-email" job
export const schedulePaymentConfirmationEmail = async (email, username, totalPrice) => {
  await agenda.now('confirm-payment-email', { email, username, totalPrice });
  console.log(`Job scheduled to send payment confirmation email to ${email}`);
};

// Function to schedule the "send-shareable-link" job
export const scheduleShareableEmail = async (email, resourceType, link) => {
  await agenda.now('send-shareable-link', { email, resourceType, link });
  console.log(`Job scheduled to send shareable link to ${email}`);
};

export const scheduleSendAppNotifications = async () => {
  await agenda.now('send app notifications');
  console.log('Job scheduled to send app notifications');
}

export const scheduleBirthdayPromo = async () => {
  await agenda.every('30 seconds', 'send-birthday-promo');
  console.log('Testing job scheduled to send birthday promo codes every minute.');
};

// Function to schedule the "send-flagged-notification" job
export const scheduleFlaggedNotification = async (itineraryId,activityId) => {
  await agenda.now('send-flagged-notification', { itineraryId, activityId });
  console.log(`Job scheduled to send flagged notification for itinerary/activity ID: ${itineraryId || activityId}`);
};
