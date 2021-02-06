module.exports = (function() {
	const express = require('express');
	const homeRouter = express.Router();
	const mysql = require('../dbcon.js');

    homeRouter.get('/', function(req, res) {
        res.redirect('/home');
    })

    homeRouter.get('/home', function(req, res) {
        res.render('index', { home: true, style: 'home.css' });
    })

	return homeRouter;
})();
