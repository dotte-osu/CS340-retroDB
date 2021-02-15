module.exports = (function() {
	const express = require('express');
	const listRouter = express.Router();
	const mysql = require('../dbcon.js');

	function getGamesbyListID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery =
			'SELECT gameName, gameReleaseYear, c.consoleName AS console, p.publisherName AS publisher ' +
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

	function getListNameByID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery = 'SELECT listName FROM Lists WHERE listID = ?';
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}
			context.name = results[0].listName;
			complete();
		});
	}

	function getListDescriptionByID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery = 'SELECT listDescription FROM Lists WHERE listID = ?';
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}
			context.description = results[0].listDescription;
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

	listRouter.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getGamesbyListID(req, res, mysql, context, complete);
		getListNameByID(req, res, mysql, context, complete);
		getListDescriptionByID(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				// add order of list
				for (let i = 0; i < context.games.length; i++) {
					context.games[i].order = i + 1;
				}

				res.render('list', context);
			}
		}
	});

	listRouter.get('/create', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getSortedGames(req, res, mysql, context, complete);
		function complete() {
			if (req.session.username == req.query.user) {
				callbackCount++;
				if (callbackCount >= 1) {
					res.render('create', context);
				}
			} else {
				res.redirect('/');
			}
		}
	});

	listRouter.post('/create', function(req, res) {
		console.log(req.body);
		const { name, game } = req.body;

		// debug
		let listInfo = {
			'Game Name': name,
			Games: game
		};
		// console.log(listInfo);
		// end debug

		res.redirect('/list?q=1');
	});

	return listRouter;
})();
