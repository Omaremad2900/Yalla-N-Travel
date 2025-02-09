import nodemailer from "nodemailer";
import config from "../../config/config.js";
import { sendNotification } from '../../services/socketService.js';
import { io } from "../../index.js";
//Might use other email service
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendAcceptanceEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "Yalla nTravel<ismaielnagaty@live.com>",
    to,
    subject,
    text,
  };

  console.log(`Sending email ${to}`);
  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}`);
};

// send email to confirm payment
export const sendPaymentConfirmationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "Yalla nTravel<ismaielnagaty@live.com>",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}`);
};

// Function for admin to reply to complaints
export const sendComplaintReplyEmail = async (to, subject, text, adminEmail) => {
  const mailOptions = {
    from: adminEmail,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Reply email sent to ${to}`);
};

    
  

export const sendShareableLink = async (from, to, subject, link)=> {
  const mailOptions ={
    from,
    to,
    subject,
    text: `Hey come check this out!: ${link} `
  };
  
  console.log(`Sending shareable link to ${to}`);
  await transporter.sendMail(mailOptions);
  console.log(`Shareable link sent to ${to}`);
};


export const sendEmailNotification = async (email, { name, startTime }) => {
  const mailOptions = {
      from: 'Yalla nTravel<ismaielnagaty@live.com>',
      to: email,
      subject: `Reminder: Upcoming Event - ${name}`,
      text: `Hello! Your event "${name}" is scheduled for ${startTime}.`,
  };
await transporter.sendMail(mailOptions);
console.log(`Email notification sent to ${email}`);
}

export const sendOutofStockNotification = async (email, emailBody) => {
  const mailOptions = {
      from: 'Yalla nTravel<ismaielnagaty@live.com>',
      to: email,
      subject: 'Product Out of Stock',
      text: emailBody,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Email notification sent to ${email}`);
}

//Function to send app notifications
export const sendAppNotification = async (userId, { message, eventId }) => {
  console.log(`Sending app notification to user ${userId}`);
  io.to(userId).emit('notification', { message, eventId });
  return { success: true, message: 'Notification sent successfully.' };
};

