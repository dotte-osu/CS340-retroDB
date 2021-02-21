module.exports = (function() {
	const express = require('express');
	const adminRouter = express.Router();
	const mysql = require('../dbcon.js');
	const bodyParser = require('body-parser');

	function getAllGames(req, res, mysql, context, complete) {
		const sqlQuery =
			'SELECT g.gameID, g.gameName, g.gameReleaseYear, c.consoleName, p.publisherName ' +
			'FROM Games g ' +
			'INNER JOIN Consoles c ON g.consoleID = c.consoleID ' +
			'INNER JOIN Publishers p ON g.publisherID = p.publisherID';
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
	adminRouter.get('/update/game/:id', function(req, res) {
		var context = { admin: true };
		context.gameActive = 'active';
		// TODO: add game data to context based off of id

		res.render('update', context);
	});

	adminRouter.get('/update/console/:id', function(req, res) {
		var context = { admin: true };
		context.consoleActive = 'active';
		// TODO: add console data to context based off of id

		res.render('update', context);
	})

	adminRouter.get('/update/publisher/:id', function(req, res) {
		var context = { admin: true };
		context.publisherActive = 'active';
		// TODO: add publisher data to context based off of id

		res.render('update', context);
	})

	adminRouter.get('/update/user/:id', function(req, res) {
		var context = { admin: true };
		context.userActive = 'active';
		// TODO: add user data to context based off of id

		res.render('update', context);
	})

	// adds a game, redirects to the games page after adding
	adminRouter.post('/games', function(req, res) {
		const sqlQuery = 'INSERT INTO Games (gameName, gameReleaseYear, consoleID, publisherID) VALUES (?, ?, ?, ?)';
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
		const sqlQuery = 'INSERT INTO Consoles (consoleName, consoleReleaseYear, consoleDeveloper, consoleType) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.consoleName, req.body.consoleReleaseYear, req.body.consoleDeveloper, req.body.consoleType ];

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
		const sqlQuery = 'INSERT INTO Publishers (publisherName, yearFounded, hqCountry, ceo) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.publisherName, req.body.yearFounded, req.body.hqCountry, req.body.ceo ];

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
