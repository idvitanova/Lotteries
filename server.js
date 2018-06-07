const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const path = require('path');
const config = require('./config');
const routes = require('./routes/index');
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('./views/public'));
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if(req.cookies.user_sid&&!req.session.user){
        res.clearCookie('user_sid');
    }
    next();
});

app.use('/', routes);

app.set('view engine', 'ejs');
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);    
});

app.listen(config.port);