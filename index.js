/**
 * Starting point of out application
 * Habba 2019
 */

require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const formidable = require('express-formidable');

const config = require('./config.js');
const app = express();
const port = config[app.get('env')].port;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(formidable());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/apl', controllers.aplRouter);
app.use('/afl', controllers.aflRouter);
app.use('/events', controllers.eventRouter);
app.use('/auth', controllers.authRouter);
app.use('/holy', controllers.holympicsRouter);




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
