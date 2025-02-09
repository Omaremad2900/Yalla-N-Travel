import Tag from '../models/tag.model.js';

export default class TagService {
    async findOrCreateTag(name, type) {
        const normalizedTagName = name.toLowerCase();

        let tag = await Tag.findOne({ name: normalizedTagName, type });
        
        if (tag) {
            return tag._id;
        }

        tag = new Tag({ name: normalizedTagName, type });
        await tag.save();
        return tag._id;
    }

    async createTag(data) {
        const tag = new Tag(data);
        return await tag.save();
    }
    
    async getAllTags(){
        return await Tag.find({});
    }
}