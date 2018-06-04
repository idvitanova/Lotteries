const express = require('express');
const app = express();
const path = require('path');
const config = require('./config');

const routes = require('./routes/index');

app.use('/', routes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);    
});

app.listen(config.port);