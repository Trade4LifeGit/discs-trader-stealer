const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const stealerRouter = require('./routers/stealRouter');
const {notFound, errorHandler} = require('./middlewares/requestHandlers')

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', stealerRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
