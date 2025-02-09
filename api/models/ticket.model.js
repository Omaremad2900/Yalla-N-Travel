import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status:{
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending'
    },
    price: {
        type: Number,
        required: true,
        },
   itinerary:
         {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Itinerary',
         }
   ,
   activity:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Activity',
   },
   paymentId:{
            type: String,
   },
   paymentType:{
            type: String,
            enum: ['card', 'wallet'],
           
   }

}, { timestamps: true });
const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

