const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.send('You are on the homepage');
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname +'/../views/login.html' ) );
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname +'/../views/register.html'));
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname +'/../views/home.html'));
});

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname +'/../views/login.html'));
});

module.exports = router;