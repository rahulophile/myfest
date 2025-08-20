require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vision-fest-25');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123!',
      role: 'super_admin',
      permissions: [
        'view_users',
        'view_events', 
        'view_registrations',
        'manage_events',
        'manage_users'
      ]
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123!');
    console.log('Role:', admin.role);
    console.log('Permissions:', admin.permissions);

    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin(); 