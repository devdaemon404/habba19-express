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
const fs = require('fs');
const controllers = require('./controllers');
const formidable = require('express-formidable');
const ev = require('express-validation');
const { Response, ERR_CODE } = require('./helpers/response-helper');
const config = require('./config.js');
const app = express();
const port = config[app.get('env')].port;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(logger('combined', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}))
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
app.use('/workshop', controllers.workshopRouter)

app.use(function (err, req, res, next) {
    console.log(req.body);
    // specific for validation errors
    if (err instanceof ev.ValidationError) return res.send(new Response().withError(ERR_CODE.VALIDATION_ERR));
    // other type of errors, it *might* also be a Runtime Error
    res.send({
        success: false,
        error: 'FTS'
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
