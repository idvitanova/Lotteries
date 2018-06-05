const express = require('express');
const router = express.Router();
var request = require('request');
var data = {
    message: "",
    user: {
        name: "Iliyana",
        balance: "500"
    }
}
router.get('/', (req, res) => {
    data.message = '';

    res.render('../views/pages/index');
});

router.get('/home', (req, response) => {
    data.message = '';
    var options = {
        url: config.externalApi + config.api_lottaries.url + config.api_token + '/limit/5/variant/1' + config.api_lottaries.file,
        method: 'GET'
    }

    request(options.url, function (error, res, body) {
        body = JSON.parse(body);
        response.render('../views/pages/home', data);
    });
    response.render('../views/pages/home', data);
});

router.get('/login', (req, res) => {
    data.message = '';
    res.render('../views/pages/login', data);
});

router.post('/login', (req, res) => {
    data.message = '';
    var options = {
        url: config.externalApi + config.api_login.url + config.api_token + config.api_login.file,
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { email: req.body.email, pass: req.body.pass }
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
        }
        if (!error && body.status == 200) {
            res.render('../views/pages/home');
        }
        res.render('../views/pages/login', data);
    });
});

router.get('/register', (req, res) => {
    data.message = '';
    res.render('../views/pages/register', data);
});

router.post('/register', (req, res) => {
    data.message = '';
    req.body.accepted_tc = req.body.accepted_tc == 'on' ? 1 : 0;
    req.body.confirmed_minimum_age = req.body.confirmed_minimum_age == 'on' ? 1 : 0;
    var options = {
        url: config.externalApi + config.api_registration.url + config.api_token + config.api_registration.file,
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        form: {
            email: req.body.email,
            password: req.body.pass,
            accepted_tc: req.body.accepted_tc,
            confirmed_minimum_age: req.body.confirmed_minimum_age
        }
    }

    request(options, function (error, response, body) {
        body = JSON.parse(body);
        data.message = 'User Registration Failed! ';
        if (!error && body.status == 200) {
            res.render('../views/pages/login', { message: 'Success!' });
        }
        if (body.status == 403 || body.status == 412 || body.status == 501) {
            switch (body.status) {
                case 403: data.message += 'Site not specified or invalid token!'; break;
                case 412: data.message += 'Unable to validate POST-Data!'; break;
                case 501: data.message += 'Error during registration!'; break;
            }
        }

        if (body.message) {
            body.message = Array.isArray(body.message) ? body.message : [body.message];
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
        }
        res.render('../views/pages/register', { message: data.message });
    });

});

router.get('/user', (req, res) => {
    data.message = '';
    var options = {
        url: config.externalApi + config.api_registration.url + config.api_token + config.api_registration.file,
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            email: req.body.email,
            password: req.body.pass,
            accepted_tc: req.body.accepted_tc == 'on' ? 1 : 0,
            confirmed_minimum_age: req.body.confirmed_minimum_age == 'on' ? 1 : 0
        }
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            res.render('../views/pages/login');
            return body;
        }
    });

    res.render('../views/pages/index', data);
});

router.post('/user', (req, res) => {
    data.message = '';
    res.render('../views/pages/index', data);
});

module.exports = router;