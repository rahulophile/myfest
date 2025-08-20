# Vision Fest 25 - Server

This is the backend server for Vision Fest 25, a technical festival organized by GEC Vaishali.

## 🚀 Features

- **User Authentication & Authorization**: Secure JWT-based authentication with refresh tokens
- **Event Management**: Complete CRUD operations for festival events
- **Admin Panel**: Administrative controls for managing events and users
- **Security Features**: Rate limiting, CORS protection, security headers
- **Email Integration**: Nodemailer for notifications and password resets
- **MongoDB Integration**: Robust database with Mongoose ODM

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Long-lived refresh tokens with short-lived access tokens
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for comprehensive security
- **Input Validation**: Comprehensive validation for all user inputs
- **Password Security**: Bcrypt hashing with salt rounds
- **CORS Protection**: Configured CORS with origin restrictions

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vision-fest-cursor/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/vision-fest-25
   
   # JWT Secrets (CHANGE THESE IN PRODUCTION!)
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   
   # Admin Credentials (CHANGE THESE IN PRODUCTION!)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure-admin-password
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   mongod
   
   # In another terminal, setup admin user
   npm run setup-admin
   ```

5. **Populate Sample Events**
   ```bash
   npm run populate-events
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8000`

## 📚 API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh-token` - Refresh access token
- `POST /api/admin/login` - Admin login

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/forgot-userid` - Forgot user ID
- `POST /api/users/forgot-password` - Forgot password

## 🔐 Security Best Practices

### JWT Configuration
- Access tokens expire in 7 days
- Refresh tokens expire in 30 days
- Unique token IDs (JTI) for each token
- Algorithm: HS256

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- IP-based tracking with lockout periods

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

## 🗄️ Database Models

### User Model
- Unique VZN25-based user IDs
- Email and registration number validation
- Password hashing with bcrypt
- Event participation tracking

### Event Model
- Comprehensive event information
- Team size constraints
- Registration deadlines
- Participant management

### Admin Model
- Secure admin authentication
- Role-based access control

## 🧪 Testing

```bash
# Run tests
npm test

# Health check
curl http://localhost:8000/health
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **JWT Errors**
   - Check JWT_SECRET in `.env`
   - Ensure token format is correct
   - Verify token expiration

3. **CORS Issues**
   - Check CLIENT_URL in `.env`
   - Ensure client is running on correct port
   - Verify CORS configuration

4. **Rate Limiting**
   - Check request frequency
   - Wait for lockout period to expire
   - Verify IP address tracking

### Logs
- Server logs are displayed in console
- MongoDB connection status is logged
- Authentication attempts are tracked

## 🔄 Updates and Maintenance

### Updating Events
```bash
npm run populate-events
```

### Updating Admin
```bash
npm run setup-admin
```

### Database Backup
```bash
mongodump --db vision-fest-25 --out ./backup
```

## 📞 Support

For technical support or questions:
- Email: vision25@gecvaishali.ac.in
- GitHub Issues: [Repository Issues]

## 📄 License

This project is licensed under the ISC License.

---

**⚠️ Important Security Notes:**
- Change all default passwords and secrets in production
- Use strong, unique JWT secrets
- Enable HTTPS in production
- Regularly update dependencies
- Monitor server logs for suspicious activity
- Implement proper backup strategies 