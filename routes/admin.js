module.exports = (function() {
	const express = require('express');
	const adminRouter = express.Router();
	const mysql = require('../dbcon.js');

	function getAllGames(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Games';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Games:', error);
				res.end();
			}

			context.games = results;
			complete();
		});
	}

	function getAllConsoles(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Consoles';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Consoles:', error);
				res.end();
			}

			context.consoles = results;
			complete();
		});
	}

    function getAllPublishers(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Publishers';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Publishers:', error);
				res.end();
			}

			context.publishers = results;
			complete();
		});
	}

    function getAllUsers(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Users';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Users:', error);
				res.end();
			}

			context.users = results;
			complete();
		});
	}

	adminRouter.get('/', function(req, res) {
		var context = {
			admin: true,
			message: true
		};
		res.render('admin', context);
	});

	adminRouter.get('/games', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			gamesActive: 'active'
		};
		getAllGames(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	adminRouter.get('/consoles', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			consolesActive: 'active'
		};
		getAllConsoles(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	adminRouter.get('/publishers', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			publishersActive: 'active'
		};
		getAllPublishers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	adminRouter.get('/users', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			usersActive: 'active'
		};
		getAllUsers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	return adminRouter;
})();
