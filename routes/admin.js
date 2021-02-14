module.exports = (function() {
	const express = require('express');
	const adminRouter = express.Router();
	const mysql = require('../dbcon.js');
	const bodyParser = require('body-parser');

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

	// displays all games
	adminRouter.get('/games', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			gamesActive: 'active'
		};
		getAllGames(req, res, mysql, context, complete);
		getAllConsoles(req, res, mysql, context, complete);
		getAllPublishers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				res.render('admin', context);
			}
		}
	});

	// displays all consoles
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

	// displays all publishers
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

	// displays all users
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

	// displays page for updating information
	// TODO: finish this
	adminRouter.get('/update/:type', function(req, res) {
		var context = { admin: true };
		var type = req.params.type;

		// determine update type
		if (type == 'game') {
			context.gameActive = 'active';
		}
		if (type == 'console') {
			context.consoleActive = 'active';
		}
		if (type == 'publisher') {
			context.publisherActive = 'active';
		}
		if (type == 'user') {
			context.userActive = 'active';
		}

		res.render('update', context);
	});

	// adds a game, redirects to the games page after adding
	adminRouter.post('/games', function(req, res) {
		const sqlQuery =
			'INSERT INTO Games (gameName, gameReleaseYear, consoleID, publisherID) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.gameName, req.body.gameReleaseYear, req.body.consoleID, req.body.publisherID ];
		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/games');
		});
	});

	// adds a console, redirects to the consoles page after adding
	adminRouter.post('/consoles', function(req, res) {
		const sqlQuery =
			'INSERT INTO Consoles (consoleName, consoleDeveloper, consoleType) VALUES (?, ?, ?)';
		const inserts = [ req.body.consoleName, req.body.consoleDeveloper, req.body.consoleType];

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/consoles');
		});
	});

	// adds a publisher, redirects to the publishers page after adding
	adminRouter.post('/publishers', function(req, res) {
		const sqlQuery =
			'INSERT INTO Publishers (publisherName, yearFounded, hqCountry, ceo) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.publisherName, req.body.yearFounded, req.body.hqCountry, req.body.ceo];

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/publishers');
		});
	});

	return adminRouter;
})();
