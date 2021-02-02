module.exports = (function() {
	const express = require('express');
	const listRouter = express.Router();
	const mysql = require('../dbcon.js');

	function getGamesbyListID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery =
			'SELECT gameName, gameReleaseYear, c.consoleName AS console, publisher ' +
			'FROM Games g ' +
			'INNER JOIN GamesLists gl on gl.gameID = g.gameID ' +
			'INNER JOIN Lists l on l.listID = gl.listID ' +
			'WHERE l.listID = ' +
			mysql.pool.escape(listID + '%');

		console.log('list:', listID);
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
		const sqlQuery = 'SELECT listName FROM Lists WHERE listID = ' + mysql.pool.escape(listID + '%');
		console.log('list:', listID);
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}
			context.name = results;
			complete();
		});
	}

	function getListDescriptionByID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery = 'SELECT listDescription FROM Lists WHERE listID = ' + mysql.pool.escape(listID + '%');
		console.log('list:', listID);
		mysql.pool.query(sqlQuery, listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}
			context.description = results;
			complete();
		});
	}

	listRouter.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		// var mysql = req.app.get('mysql');
		getGamesbyListID(req, res, mysql, context, complete);
		getListNameByID(req, res, mysql, context, complete);
		getListDescriptionByID(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {

				console.log(context)

			// add order of list
			for (let i = 0; i < context.games.length; i++) {
				context.games[i].order = i + 1;
			}

				res.render('list', context);
			}
		}
	});

	return listRouter;
})();
