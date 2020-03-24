/* jshint esversion: 8 */
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer  = require('multer');
const uuid4 = require('uuid/v4');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('./models/user-model');
const options = require('./utilities/mongo-connect-options');
const config = require('./utilities/database-configuration');
const userRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const nonUserCartRoutes = require('./routes/nonusercart-routes');
const paymentRoutes = require('./routes/payment-routes');

const checkJWT = require('./middlewares/check-jwt');

app.get('/', (req, res) => {
  res.send('Hello World ' + process.env.DB_CONNECTION2 + ' ' + process.env.PORT);
});
exports.test = async (req, res) => {
  res.send('Hello World');
};

// Enabling CORS
app.use(cors());

// Initializing bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uuid = uuid4();

const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/profile_pictures');
  },

  filename: (req, file, cb) => {
    cb(null, uuid + '-' + file.originalname);
  },
});

const productPictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/product_pictures');
  },

  filename: (req, file, cb) => {
    cb(null, uuid + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
    cb(null, true);
  else
    cb(null, false);
};

// Making the following folders accessible { profile_pictures, product_pictures }
app.use('/assets/profile_pictures', express.static(path.join(__dirname, 'assets', 'profile_pictures')));
app.use('/assets/product_pictures', express.static(path.join(__dirname, 'assets', 'product_pictures')));

// Making the following inputfieds accessible { profile_picture, product_picture }
// app.use(multer({ storage: profilePictureStorage, fileFilter: fileFilter }).single('profile_picture'));
app.use(multer({ storage: productPictureStorage, fileFilter: fileFilter }).single('product_picture'));


// Initializing userRoutes and productRoutes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', nonUserCartRoutes);
app.use('/stripe', paymentRoutes);

app.use(checkJWT, (req, res, next) => {
  if (!req.userId) {
    req.userId = null;
    req.userLoggedIn = false;

    return next();
  }

  User.findById(req.userId).then(user => {
    if (!user) return next();

    req.userLoggedIn = true;
    req.user = user;;

    next();
  })
  .catch(error => next(new Error(error)));
});

// Initializing routes for other functionalities
app.use('/api', cartRoutes);
// app.use('/api', nonUserCartRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// MongoDB database connection through mongoose
mongoose.connect(config.database, options, error => {
  if (error) console.log(error);
  else console.log('Connected to the database.');
})
.catch(error => console.log(error));

// Create the server and cause it to keep listening for changes
app.listen(process.env.PORT || config.port, () => console.log(`Running on port: ${config.port}`));
