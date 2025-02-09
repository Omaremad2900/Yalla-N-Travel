import mongoose from 'mongoose';

const tourismGovernorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TourismGovernor', tourismGovernorSchema);