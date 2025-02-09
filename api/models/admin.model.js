// temp admin model to work with for now until furthur notice

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Admin', adminSchema);