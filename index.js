const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();

const connectDB = require('./config/db');
// const seedServices = require('./config/seedServices');
const colors = require('colors');
const createUserRoute = require('./routes/createUserRoute');
const getUserRoute = require('./routes/getUserRoute');
const deleteUserRoute = require('./routes/deleteUserRoute');
const profileRoute = require('./routes/profileRoute');
const updateProfileRoute = require('./routes/updateProfileRoute');
const complaintRoutes = require('./routes/complaintRoutes');
const path = require('path');
const serviceRoute = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const adminRoutes = require('./routes/adminRoutes');
const sessionMiddleware = require('./middleware/session');


dotenv.config();
connectDB();
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);


const app = express();
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.send('Welcome to our site');
  });
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  

// Routes
app.use('/api/users', createUserRoute);
app.use('/api/users', getUserRoute);
app.use('/api/users', deleteUserRoute);
app.use('/api/users', profileRoute);
app.use('/api/users', updateProfileRoute);
app.use('/api/complaints', complaintRoutes);
app.use('/api/issues', serviceRoute);
app.use('/api/users', userRoutes);
app.use('/api/users', forgotPasswordRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/admin', adminRoutes);

// app.use('/admin', require('./routes/admin'));

// Serve uploaded images dynamically


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
