const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const stealerRouter = require('./routers/stealRouter');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', stealerRouter);

module.exports = app;
