'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const app = express();

const helpers = require('./lib/helpers');
const routes = require('./routes');

app.disable('x-powered-by');

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: helpers
}));

app.set('view engine', '.hbs');
app.set('env', 'development');

app.locals.isSingle = false;


app.use(favicon(path.join(__dirname, 'favicon.png')));
app.use(bodyParser.urlencoded( { extended: true } ));

app.use('/', routes);

app.use('/public', express.static(path.join(__dirname, '/public'), {
  maxAge: 0,
  dotfiles: 'ignore',
  etag: false
}));




if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

app.listen(port);
