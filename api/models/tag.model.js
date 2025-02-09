import mongoose from 'mongoose';

const knownTypes = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tag name is required'],
        trim: true,
        lowercase: true,
    },
    type: {
        type: String,
        required: true,
        enum: knownTypes,
    }
}, { timestamps: true });

tagSchema.index({ name: 1, type: 1 }, { unique: true });

tagSchema.pre('save', async function (next) {
    this.name = this.name.toLowerCase();
    next();
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;