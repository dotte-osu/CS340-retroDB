module.exports = (function() {
	const express = require('express');
	const adminRouter = express.Router();
	const mysql = require('../dbcon.js');

    adminRouter.get('/', function(req, res) {
		context = {
			admin: true,
            message: true
		};
		res.render('admin', context);
	});

    adminRouter.get('/games', function(req, res) {
		context = {
			admin: true,
            gamesActive: 'active'
		};
		res.render('admin', context);
	});

    adminRouter.get('/consoles', function(req, res) {
		context = {
			admin: true,
            consolesActive: 'active'
		};
		res.render('admin', context);
	});

    adminRouter.get('/publishers', function(req, res) {
		context = {
			admin: true,
            publishersActive: 'active'
		};
		res.render('admin', context);
	});

    adminRouter.get('/users', function(req, res) {
		context = {
			admin: true,
            usersActive: 'active'
		};
		res.render('admin', context);
	});

	return adminRouter;
})();
