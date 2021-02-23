module.exports = (function() {
	const express = require('express');
	const listRouter = express.Router();
	const mysql = require('../dbcon.js');

	function getGamesbyListID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery =
			'SELECT g.gameID, g.gameName, g.gameReleaseYear, c.consoleName AS console, p.publisherName AS publisher ' +
			'FROM Games g ' +
			'INNER JOIN GamesLists gl on gl.gameID = g.gameID ' +
			'INNER JOIN Lists l on l.listID = gl.listID ' +
			'INNER JOIN Consoles c on g.consoleID = c.consoleID ' +
			'INNER JOIN Publishers p on g.publisherID = p.publisherID ' +
			'WHERE l.listID = ?';

		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Games:', error);
				res.end();
			}

			context.games = results;
			complete();
		});
	}

	function getListByID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery = 'SELECT * FROM Lists WHERE listID = ?';
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}
			if (!results[0]) {
				context.failed = true;
			} else {
				context.name = results[0].listName;
				context.description = results[0].listDescription;
				context.listID = results[0].listID;

				// slice lastUpdated
				var lastUpdated = String(results[0].lastUpdated);
				lastUpdated = lastUpdated.slice(4, 15);
				context.lastUpdated = lastUpdated;
			}
			complete();
		});
	}

	function getUsernameFromListID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery = 'SELECT u.username FROM Users u INNER JOIN Lists l ON l.createdBy = u.userID AND l.listID = ?';
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Username:', error);
				res.end();
			}
			if (!results[0]) {
				context.failed = true;
			} else {
				context.username = results[0].username;
			}
			complete();
		});
	}

	function getSortedGames(req, res, mysql, context, complete) {
		const sqlQuery =
			'SELECT g.gameID, g.gameName, c.consoleName ' +
			'FROM Games g ' +
			'LEFT JOIN Consoles c ON g.consoleID = c.consoleID ' +
			'ORDER BY gameName, consoleName';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Games:', error);
				res.end();
			}
			context.games = results;
			complete();
		});
	}

	function getUserIDFromUsername(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT userID FROM Users WHERE username = ?';
		mysql.pool.query(sqlQuery, req.query.user, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch User:', error);
				res.end();
			}
			context.userID = results[0].userID;
			complete();
		});
	}

	function getDate() {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		if (month <= 9) {
			month = '0' + month;
		}
		var day = d.getDate();
		if (day <= 9) {
			day = '0' + day;
		}
		var date = year + '-' + month + '-' + day;
		return date;
	}

	listRouter.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getGamesbyListID(req, res, mysql, context, complete);
		getListByID(req, res, mysql, context, complete);
		getUsernameFromListID(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				if (context.failed) {
					console.log('List not found:', req.query.q);
					res.redirect('/');
				} else {
					// add order of list
					for (let i = 0; i < context.games.length; i++) {
						context.games[i].order = i + 1;
					}

					// check if this is the logged in user's list
					if (context.username == req.session.username) {
						context.myPage = true;
					}
					res.render('list', context);
				}
			}
		}
	});

	listRouter.get('/create', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getSortedGames(req, res, mysql, context, complete);
		getUserIDFromUsername(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				if (req.session.username == req.query.user) {
					res.render('create', context);
				} else {
					res.redirect('/');
				}
			}
		}
	});

	listRouter.post('/create', function(req, res) {
		var lastUpdated = getDate();

		// insert into list
		const sqlQuery = 'INSERT INTO Lists (listName, listDescription, lastUpdated, createdBy) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.listName, req.body.listDescription, lastUpdated, req.body.createdBy ];
		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log('Failed to insert List:', error);
				res.end();
			}

			// insert games and list into GamesLists
			const sqlQuery = 'INSERT INTO GamesLists (listID, gameID) VALUES (?, ?)';
			const listID = results.insertId;
			var callbackCount = 0;

			// insert each game in request body
			for (i = 0; i < req.body.game.length; i++) {
				const gameID = req.body.game[i];
				const inserts = [ listID, gameID ];
				mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
					if (error) {
						console.log('Failed to insert List:', error);
						res.end();
					}
					callbackCount++;
					if (callbackCount >= req.body.game.length) {
						res.redirect('/list?q=' + listID);
					}
				});
			}
		});
	});

	listRouter.post('/delete', function(req, res) {
		const sqlQuery = 'DELETE FROM GamesLists WHERE listID = ? and gameID = ?';
		const inserts = [ req.body.listID, req.body.gameID ];

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log('Failed to delete from GamesLists:', error);
				res.end();
			}
			res.redirect('/list?q=' + req.body.listID);
		});
	});

	return listRouter;
})();
