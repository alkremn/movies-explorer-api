const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const limiter = require('./configs/ratelimiter');
const routes = require('./routes/index');
const { notFound, errorHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const app = express();

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

app.use(requestLogger);

// database connection
require('./configs/dbconfig').connectDb();

// middleware
app.use(cors);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errors());

app.use('/', routes);

app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
