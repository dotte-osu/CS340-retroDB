module.exports = (function() {
	const express = require('express');
	const userRouter = express.Router();
	const mysql = require('../dbcon.js');

	function getUserByUsername(req, res, mysql, context, complete) {
		const username = req.params.username;
		const sqlQuery = 'SELECT username, firstName, lastName FROM Users WHERE username = ?';
		mysql.pool.query(sqlQuery, username, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch User:', error);
				res.end();
			}
			// check if username exists
			if (!results[0]) {
				context.failed = true;
			} else {
				context.username = results[0].username;
				context.firstName = results[0].firstName;
				context.lastName = results[0].lastName;
				// TODO: context.user = true IF :username is logged in username
			}
			complete();
		});
	}

	function getListsByUsername(req, res, mysql, context, complete) {
		const username = req.params.username;
		const sqlQuery =
			'SELECT l.listID, l.listName ' +
			'FROM Lists l ' +
			'INNER JOIN Users u ON l.createdBy = u.userID AND u.userID = ' +
			'(SELECT userID FROM Users WHERE username = ?)';
		mysql.pool.query(sqlQuery, username, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}

			// check if username exists
			if (!results[0]) {
				context.failed = true;
			} else {
				context.lists = results;
			}
			complete();
		});
	}

	userRouter.get('/login', function(req, res) {
		res.render('login', { login: true, style: 'login.css' });
	});

	userRouter.get('/register', function(req, res) {
		res.render('register', { register: true, style: 'login.css' });
	});

	userRouter.get('/admin', function(req, res) {
		context = {
			admin: true,
            message: true
		};
		res.render('admin', context);
	});

    userRouter.get('/admin/games', function(req, res) {
		context = {
			admin: true,
            gamesActive: 'active'
		};
		res.render('admin', context);
	});

    userRouter.get('/admin/consoles', function(req, res) {
		context = {
			admin: true,
            consolesActive: 'active'
		};
		res.render('admin', context);
	});

    userRouter.get('/admin/publishers', function(req, res) {
		context = {
			admin: true,
            publishersActive: 'active'
		};
		res.render('admin', context);
	});

    userRouter.get('/admin/users', function(req, res) {
		context = {
			admin: true,
            usersActive: 'active'
		};
		res.render('admin', context);
	});

	userRouter.get('/:username', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getUserByUsername(req, res, mysql, context, complete);
		getListsByUsername(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				if (context.failed) {
					console.log('Username not found:', req.params.username);
					res.redirect('/');
				} else {
					console.log(context);
					res.render('user', context);
				}
			}
		}
	});

	userRouter.post('/login', function(req, res) {
		const { username, password } = req.body;

		// debug
		let userInfo = {
			username: username,
			password: password
		};
		console.log(userInfo);
		// end debug

		res.redirect('/user');
	});

	userRouter.post('/register', function(req, res) {
		const { username, firstName, lastName, email, password, confirmPassword } = req.body;

		// debug
		let userInfo = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			confirmPassword: confirmPassword
		};
		console.log(userInfo);
		// end debug

		res.redirect('/user');
	});

	return userRouter;
})();
