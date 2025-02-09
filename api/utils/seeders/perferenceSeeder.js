import preferenceTagModel from "../../models/preferenceTag.model.js";
import ActivityCategory from "../../models/activityCategory.model.js";

const createIfNotExists = async (Model, name, modelName) => {
    const existingItem = await Model.findOne({ name });
    if (existingItem) {
        console.log(`${modelName} '${name}' already exists`);
        return existingItem;
    }
    const newItem = new Model({ name });
    await newItem.save();
    console.log(`${modelName} '${name}' created successfully`);
    return newItem;
};

export const seedPreference = async () => { 
    try {
        await createIfNotExists(preferenceTagModel, "history", "Preference Tag");
        await createIfNotExists(ActivityCategory, "historical sites", "Activity Category");

        console.log("Seeding completed successfully");
    } catch (error) {
        console.error(`Error seeding preferences: ${error}`);
    }
};
