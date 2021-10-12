require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
}); // Config environment
const express = require('express'); // Import express
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express(); // Make express app

// CORS
app.use(cors());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Use helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
} else {
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {
      flags: 'a',
    }
  );

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));
}

/* Import routes */
const admins = require('./routes/admins');
const farmers = require('./routes/farmers');
const landAreas = require('./routes/landAreas');
const plants = require('./routes/plants');
const seedTypes = require('./routes/seedTypes');
const users = require('./routes/users');
const vegetables = require('./routes/vegetables');

/* Import errorHandler */
const errorHandler = require('./middlewares/errorHandler');

/* Enable req.body */
app.use(express.json()); // Enable req.body JSON
// Enable url-encoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* Enable req.body and req.files (form-data) */
app.use(fileUpload());

/* Make public folder as static */
app.use(express.static('public'));

/* Use routes */
app.get('/', async (req, res, next) => {
  try {
    res.redirect('https://documenter.getpostman.com/view/3884681/TzsfmkQp');
  } catch (error) {
    next(error);
  }
});

app.use('/admins', admins);
app.use('/farmers', farmers);
app.use('/landAreas', landAreas);
app.use('/plants', plants);
app.use('/seedTypes', seedTypes);
app.use('/users', users);
app.use('/vegetables', vegetables);

/* If routes not found */
app.all('*', (req, res, next) => {
  try {
    next({ message: 'Endpoint not found', statusCode: 404 });
  } catch (error) {
    next(error);
  }
});

/* User errorHandler */
app.use(errorHandler);

/* Running server */
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log(`Server running on port 3000!`));
}

module.exports = app;
