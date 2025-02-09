import mongoose from "mongoose";

const transportationTicketSchema = new mongoose.Schema
(
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        transportation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transportation",
        required: true,
        },
        status:{
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
        }
    }
    );
    const TransportationTicket = mongoose.model("TransportationTicket", transportationTicketSchema);
    export default TransportationTicket;