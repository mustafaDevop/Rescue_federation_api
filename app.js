const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/auth');
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { jsonHeader } = require('./middlewares/headers');

const indexRouterV1 = require('./routes/v1/');

const app = express();





app.set('etag', false);
app.set('trust proxy', false);



const corsOptions = {
  origin: [
    'https://rescue-federation-apii-3wg2k49r9-mustafadevops-projects.vercel.app', 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 
};

// 1. FIRST: Enable CORS for all routes
app.use(cors(corsOptions));

// 2. SECOND: Handle preflight requests for all routes
app.options('/{*corsPreflight}', cors());

// 3. THEN: Add your other middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use json for response
app.use(jsonHeader);

// different path for files
app.use('/filler', express.static(path.join(__dirname, 'public/uploads')));

// v1 routes
app.use('/v1.0', indexRouterV1);



if (config.env !== 'production') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// database sync
const { dB } = require('./models/index');



module.exports = app;
