// seeders/adminSeeder.js
import User from "../../models/user.model.js";
import Admin from "../../models/admin.model.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }
    const hash_password = await bcrypt.hash('pass12', 10);

    // Create admin account
    const admin = new User({
      username: 'omarAdmin',
      email: 'omarAdmin@gmail.com',
      password: hash_password, // plain password, it will be hashed in the User model
      role: 'Admin',
      isAccepted:true
    });

    await admin.save();
    const adminUser = new Admin({ user: admin._id });
    await adminUser.save();
    console.log('Admin account created successfully.');
  } catch (error) {
    console.error(`Error seeding admin: ${error}`);
  }
};
