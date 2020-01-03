const express = require('express');
const session = require('express-session');
const errorCreator = require('http-errors');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');

const db = require('./db');
const controllers = require('./controllers');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const log = fs.createWriteStream('logile.log', {flags: 'a'})
app.use(logger('combined', {stream: log}));

app.use(express.static(path.join(__dirname, '../public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        key: process.env.SESSION_KEY,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 10 * 60 * 1000
        },
        saveUninitialized: false,
        resave: false
    })
);

app.use('/', require('./routes'));

app.use((req, res, next) => {
    next(errorCreator(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('pages/error');
})

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on ${server.address().port} port`);
})

