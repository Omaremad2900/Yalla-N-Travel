import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; 

const historicalPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pictures: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  ticketPrices: {
    type: Number,
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag' // Reference to the Tag model
}],
start_date: {
  type: Date,
  required: true,
},
end_date: {
  type: Date,
  required: true,
},
preference:{
  type: String,
  default:"history"
},
category:{
  type: String,
  default:"historical sites"
},
tourismGovernor:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'TourismGovernor' // Reference to the TourismGovernor model
},
}, { timestamps: true });

// apply pagination plug in to the schema
historicalPlaceSchema.plugin(mongoosePaginate);


const HistoricalPlace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
export default HistoricalPlace;