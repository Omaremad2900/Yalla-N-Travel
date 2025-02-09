import mongoose from "mongoose";

const preferenceTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model('PreferenceTag', preferenceTagSchema);