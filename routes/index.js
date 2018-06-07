const express = require('express');
const router = express.Router();
const url = require('url');
var request = require('request');
var data = {
    message: "",
    tabName: ''
}


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/home');
    } else {
        next();
    }
}

router.get('/', sessionChecker, (req, res) => {
    data.message = '';
    res.render('../views/pages/index');
});

router.get('/home', (req, res) => {
    data = req.query;
    data.lotteries = {};
    data.message = '';
    data.tabName = '';
    if (req.session.user && req.cookies.user_sid) {
        data.user = req.session.user;
        res.render('../views/pages/home', data);
    } else {
        res.redirect('/');
    }
});

router.get('/home/:variant', (req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.redirect('/');
    } else {
        data.message = '';
        data.tabCode = req.params.variant;
        data.tabName = '';
        switch(data.tabCode){
            case '0': data.tabName='Single Games'; break;
            case '1': data.tabName='Group Games'; break;
            case '4': data.tabName='Scratch Games'; break;
            case '5': data.tabName='Combo Group Games'; break;
            case '6': data.tabName='Instant Win Games'; break;
            case '0': data.tabName=''; break;
        }
        var options = {
            url: config.externalApi + config.api_lottaries.url + config.api_token + '/variant/' + req.params.variant + config.api_lottaries.file,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }

        request(options.url, function (error, response, body) {
            body = JSON.parse(body);
            if (body.status == 200 && body.data) {
                body.data.forEach(function (element, index) {
                    body.data[index].name = (element.name == null || element.name == undefined) ? '-' : element.name;
                    body.data[index].next_draw = (element.next_draw == null || element.next_draw == undefined) ? '-' : element.next_draw;
                    body.data[index].price_share = (element.price_share == null || element.price_share == undefined) ? '-' : element.price_share;
                    body.data[index].currency = (element.currency == null || element.currency == undefined) ? '-' : element.currency;
                    body.data[index].jackpot = (element.jackpot == null || element.jackpot == undefined) ? '-' : element.jackpot;
                });
                data.lotteries = body.data;
                data.pages = body.pages;
            }
            res.render('../views/pages/home', data);
        });
    }
});

router.get('/login', sessionChecker, (req, res) => {
    data.message = '';
    data.tabName = '';
    res.render('../views/pages/login', data);
}).post('/login', (req, res) => {
    data.message = '';
    data.tabName = '';
    var options = {
        url: config.externalApi + config.api_login.url + config.api_token + config.api_login.file,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form: { email: req.body.email, pass: req.body.password }
    }

    request(options, function (error, response, body) {
        body = JSON.parse(body);
        if (body.status == 401 || body.status == 402 || body.status == 403 || body.status == 404) {
            switch (body.status) {
                case 401: data.message += 'User not found or wrong password!'; break;
                case 402: data.message += 'User crated via facebook registration, but no password set solution 1: login via facebook and set a password solution 2: request password reset mail'; break;
                case 403: data.message += 'User inactive'; break;
                case 404: data.message += 'User blocked'; break;
            }
            res.render('../views/pages/login', data);
        }
        if (!error && body.status == 200) {
            req.session.user = {
                userName: body.user.name_first + " " + body.user.name_last,
                token: body.token,
                balance: body.deposit.total,
                email: '',
                phone: '',
                name_first: '',
                name_last: ''
            };
            var options = {
                url: config.externalApi + config.api_user_edit.url + config.api_token + config.api_user_edit.user_token + req.session.user.token + config.api_user_edit.file,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            request(options, function (error, response, body) {
                body = JSON.parse(body);
                if (!error && response.statusCode == 200) {
                    req.session.user.email = body.user.email;
                    req.session.user.phone = body.user.phone;
                    req.session.user.name_first = body.user.name_first;
                    req.session.user.name_last = body.user.name_last;
                    res.redirect('/home');
                }
            });

        }
    });
});

router.get('/logout', (req, res) => {
    data.message = '';
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid', { domain: req.session.cookie.data.deposit, path: req.session.cookie.data.path });
        req.session.destroy();
    }
    res.redirect('/');
});

router.get('/register', sessionChecker, (req, res) => {
    data.message = '';
    data.tabName = '';
    res.render('../views/pages/register', data);
}).post('/register', (req, res) => {
    data.message = '';
    data.tabName = '';
    req.body.accepted_tc = req.body.accepted_tc == 'on' ? 1 : 0;
    req.body.confirmed_minimum_age = req.body.confirmed_minimum_age == 'on' ? 1 : 0;
    var options = {
        url: config.externalApi + config.api_registration.url + config.api_token + config.api_registration.file,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        form: {
            email: req.body.email,
            password: req.body.pass,
            name_first: req.body.name_first,
            name_last: req.body.name_last,
            phone: req.body.phone,
            accepted_tc: req.body.accepted_tc,
            age_confirm: req.body.confirmed_minimum_age
        }
    }

    request(options, function (error, response, body) {
        body = JSON.parse(body);

        var url = '';
        if (!error && body.status == 200) {
            url = '../views/pages/login';
            data.message = 'Success!';
        }
        if (body.status == 403 || body.status == 412 || body.status == 501) {
            data.message = 'User Registration Failed! ';
            switch (body.status) {
                case 403: data.message += 'Site not specified or invalid token!'; break;
                case 412: data.message += 'Unable to validate POST-Data!'; break;
                case 501: data.message += 'Error during registration!'; break;
            }
            body.message = Array.isArray(body.message) ? body.message : [body.message];
            data.message = 'User Registration Failed! ';
            body.message.forEach(function (errMsg) {
                switch (errMsg) {
                    case 'PASS_MISS': data.message += 'Password not submitted or empty! '; break;
                    case 'PASS_SHORT': data.message += 'Password has less than 5 characters! '; break;
                    case 'EMAIL_MISS': data.message += 'Email not submitted or empty! '; break;
                    case 'EMAIL_INVALID': data.message += 'Email has not a valid format '; break;
                    case 'EMAIL_NOINFO': data.message += 'Sending registration-email prevented by account-setting. In the future, this message will be deprecated because a subscription to info emails is mandatory.! '; break;
                    case 'GEO_AVAIL': data.message += 'GeoIP prevents registration (country blacklisted or no IP)! '; break;
                    case 'GEO_AVAIL': data.message += 'GeoIP prevents registration (country blacklisted or no IP)! '; break;
                    case 'BAD_REQUEST': data.message += 'When request type is not POST – only POST allowed, except the parameters that are mandatory in the link (like site/{API-TOKEN}) '; break;
                }
            });
            url = '../views/pages/register';
        }
        res.render(url, data);
    });

});

router.post('/user', (req, res) => {
    data.message = '';
    var options = {
        url: config.externalApi + config.api_user_edit.url + config.api_token + config.api_user_edit.user_token + req.session.user.token + config.api_user_edit.file,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form: {
            email: req.body.email,
            name_first: req.body.name_first,
            name_last: req.body.name_last,
            phone: req.body.phone
        }
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.redirect('/home');
        }
    });
});

router.get('/user', (req, res) => {
    data.message = '';
    res.render('../views/pages/index', data);
});

module.exports = router;