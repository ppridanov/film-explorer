const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewars/logger');
const limiter = require('./middlewars/limiter');
const { mongoUrl } = require('./scripts/config');
const { errHandler, notFoundErrHandler } = require('./middlewars/error-handlers');

require('dotenv').config();
const { PORT = 3000 } = process.env;
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(limiter);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .catch((err) => console.log(err.message));

app.use(requestLogger);
app.use(cookieParser());
app.use('/', require('./routes/main'));

app.use(errorLogger);
app.use(errors());

app.use('*', notFoundErrHandler);
app.use(errHandler);


app.listen(PORT);