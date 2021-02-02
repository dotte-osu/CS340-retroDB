module.exports = function() {
	const express = require('express');
	const listRouter = express.Router();

	function getGamesbyListID(req, res, mysql, context, complete) {
		const listID = req.query.q;
		const sqlQuery =
			'SELECT gameName, gameReleaseYear, console, publisher ' +
			'FROM Games g ' +
			'INNER JOIN GamesLists gl on gl.gameID = g.gameID ' +
			'INNER JOIN Lists l on l.listID = gl.listID WHERE l.listID = ' +
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
		var mysql = req.app.get('mysql');
		getGamesbyListID(req, res, mysql, context, complete);
		getListNameByID(req, res, mysql, context, complete);
		getListDescriptionByID(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				res.render('list', context);
			}
		}
	});
};

// app.get('/list', function(req, res, next) {
// 	// takes list ID as a query, and displays list of games

// 	const { id } = req.query;

// 	// pretend that an SQL query was made, and returned a list of games
// 	const name = 'My Favorites'
// 	const games = [
// 		{gameName: 'Mario Kart 64', gameReleaseYear: '1996', console: 'Nintendo 64', publisher: 'Nintendo' },
// 		{gameName: 'Super Smash Bros. Melee', gameReleaseYear: '2001', console: 'GameCube', publisher: 'Nintendo' },
// 		{gameName: "Tony Hawk's Pro Skater 4", gameReleaseYear: '2002', console: 'GameCube', publisher: 'Activision' },
// 	];

// 	// add order of list
// 	for (let i=0; i < games.length; i++) {
// 		games[i].order = i + 1
// 	}

// 	context = {}
// 	context.name = name
// 	context.games = games
// 	context.style = 'list.css'

// 	res.render('list', context);
// });
