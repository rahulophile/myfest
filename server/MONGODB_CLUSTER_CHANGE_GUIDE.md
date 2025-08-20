# 🔄 MongoDB Cluster Change Guide

## 📋 **Prerequisites**
- MongoDB Atlas account
- New cluster created
- Database user with proper permissions
- IP whitelisted

## 🚀 **Step-by-Step Process**

### **Step 1: New MongoDB Atlas Cluster Setup**

1. **Login to MongoDB Atlas**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign in with your account

2. **Create New Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0) or paid tier
   - Select cloud provider (AWS, Google Cloud, Azure)
   - Choose region closest to your users
   - Click "Create"

3. **Database Access Setup**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `visionfest_user` (or your preferred name)
   - Password: Generate strong password
   - Role: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Network Access Setup**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

### **Step 2: Update Environment Variables**

1. **Create/Update `.env` file in server folder:**
```bash
# OLD CLUSTER
# MONGODB_URI=mongodb+srv://rahulophile:Nokaboda-8294261497@roommate.phnqr.mongodb.net/

# NEW CLUSTER
MONGODB_URI=mongodb+srv://visionfest_user:YourNewPassword@your-new-cluster.mongodb.net/

# Other variables remain same
JWT_SECRET=vision-fest-25-super-secret-key-change-in-production
JWT_REFRESH_SECRET=vision-fest-25-refresh-super-secret-key-change-in-production
PORT=8000
CLIENT_URL=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123!
NODE_ENV=development
EMAIL_USER=visionfest25@gmail.com
EMAIL_PASS=your-app-password
MAX_AUTH_ATTEMPTS=5
AUTH_LOCKOUT_DURATION=900000
```

### **Step 3: Test Connection**

1. **Stop current server:**
```bash
# If running with nodemon
Ctrl + C

# If running with PM2
pm2 stop vision-fest-server
```

2. **Start server with new config:**
```bash
cd server
npm start
# or
nodemon index.js
```

3. **Check console output:**
```
MongoDB connected successfully!
```

### **Step 4: Data Migration (If Needed)**

#### **Option A: Fresh Start (Recommended for Development)**
- New cluster will be empty
- All data will be fresh
- Good for testing new features

#### **Option B: Data Migration (For Production)**
1. **Export from old cluster:**
```bash
mongodump --uri="mongodb+srv://old-user:old-pass@old-cluster.mongodb.net/"
```

2. **Import to new cluster:**
```bash
mongorestore --uri="mongodb+srv://new-user:new-pass@new-cluster.mongodb.net/" dump/
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Connection Failed**
   - Check username/password
   - Verify IP is whitelisted
   - Check cluster status

2. **Authentication Failed**
   - Verify database user permissions
   - Check if user exists in new cluster

3. **Network Timeout**
   - Check firewall settings
   - Verify cluster region

### **Connection String Format:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## 📁 **File Structure After Change**

```
server/
├── .env                    # Environment variables (NEW CLUSTER)
├── index.js               # Main server file
├── routes/                # API routes
├── models/                # MongoDB models
├── middleware/            # Custom middleware
└── MONGODB_CLUSTER_CHANGE_GUIDE.md  # This guide
```

## ✅ **Verification Checklist**

- [ ] New cluster created in MongoDB Atlas
- [ ] Database user created with proper permissions
- [ ] IP address whitelisted
- [ ] Connection string copied correctly
- [ ] `.env` file updated with new MONGODB_URI
- [ ] Server restarted
- [ ] Connection successful in console
- [ ] API endpoints working
- [ ] Data accessible (if migrated)

## 🚨 **Important Notes**

1. **Never commit `.env` files to git**
2. **Keep old cluster backup until new one is verified**
3. **Update team members about the change**
4. **Test all functionality after migration**
5. **Monitor server logs for any errors**

## 🆘 **Need Help?**

If you encounter issues:
1. Check MongoDB Atlas status page
2. Verify connection string format
3. Check server console for error messages
4. Ensure all environment variables are set correctly 