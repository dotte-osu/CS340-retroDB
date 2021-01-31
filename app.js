const express = require('express');
const mysql = require('./dbcon.js');

const app = express();
const handlebars = require('express-handlebars');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.engine(
	'handlebars',
	handlebars({
		defaultLayout: 'main',
		layoutsDir: __dirname + '/views/layouts/',
		partialsDir: __dirname + '/views/partials/'
	})
);

app.set('view engine', 'handlebars');
const port = 54322; // can change to a different port

// routes
app.get('/', (req, res) => {
	res.redirect('/home');
});

app.get('/home', function(req, res, next) {
	res.render('index', { home: true, style: 'home.css' });
});

app.get('/results', function(req, res, next) {
	res.render('results', { browse: true, style: 'results.css' });
});

app.get('/game', function(req, res, next) {
	res.render('game', { browse: true, style: 'results.css' });
});

app.get('/console', function(req, res, next) {
	res.render('console', { browse: true, style: 'results.css' });
});

app.get('/publisher', function(req, res, next) {
	res.render('publisher', { browse: true, style: 'results.css' });
});

app.get('/user', function(req, res, next) {
	res.render('user', { user: true, style: 'user.css' });
});

app.get('/user/login', function(req, res, next) {
	res.render('login', { login: true, style: 'login.css' });
});

app.get('/user/register', function(req, res, next) {
	res.render('register', { register: true, style: 'login.css' });
});

app.get('/user/admin', function(req, res, next) {
	res.render('admin', { admin: true, style: 'admin.css' });
});

app.get('/list', function(req, res, next) {
	// takes list ID as a query, and displays list of games

	const { id } = req.query;

	// pretend that an SQL query was made, and returned a list of games
	const name = 'My Favorites'
	const games = [
		{gameName: 'Mario Kart 64', gameReleaseYear: '1996', console: 'Nintendo 64', publisher: 'Nintendo' },
		{gameName: 'Super Smash Bros. Melee', gameReleaseYear: '2001', console: 'GameCube', publisher: 'Nintendo' },
		{gameName: "Tony Hawk's Pro Skater 4", gameReleaseYear: '2002', console: 'GameCube', publisher: 'Activision' },
	];

	// add order of list
	for (let i=0; i < games.length; i++) {
		games[i].order = i + 1
	}

	context = {}
	context.name = name
	context.games = games
	context.style = 'list.css'

	res.render('list', context);
});

app.get('/list/create', function(req, res, next) {
	// using JSON to simulate getting info from MySQL
	const games = [
		{ id: 1, name: 'Mario Kart 64', console: 'Nintendo 64' }, // any other info is extraneous rn
		{ id: 2, name: 'Super Smash Bros. Melee', console: 'GameCube' },
		{ id: 3, name: 'Bubsy 3D', console: 'PlayStation 2' },
		{ id: 4, name: "Tony Hawk's Pro Skater 4", console: 'GameCube' },
		{ id: 5, name: "Tony Hawk's Pro Skater 4", console: 'PlayStation 2' }
	];

	// sort alphabetically by game name, then by console name
	games.sort(function(a, b) {
		const gameA = a.name.toUpperCase();
		const gameB = b.name.toUpperCase();
		const consoleA = a.console.toUpperCase();
		const consoleB = b.console.toUpperCase();

		let sort = 0;
		// game sort
		if (gameA > gameB) {
			sort = 1;
		} else if (gameA < gameB) {
			sort = -1;
		} else if (gameA == gameB) {
			// console sort
			if (consoleA > consoleB) {
				sort = 1;
			} else if (consoleA < consoleB) {
				sort = -1;
			}
		}
		return sort;
	});

	context = { style: 'create.css', games: games };
	res.render('create', context);
});

app.post('/user/login', function(req, res, next) {
	const { username, password } = req.body;

	// debug
	let userInfo = {
		username: username,
		password: password
	};
	console.log(JSON.stringify(userInfo));
	// end debug

	res.redirect('/user');
});

app.post('/user/register', function(req, res, next) {
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
	console.log(JSON.stringify(userInfo));
	// end debug

	res.redirect('/user');
});

app.post('/list/create', function(req, res, next) {
	const { name, game } = req.body;

	// debug
	let listInfo = {
		'Game Name': name,
		Games: game
	};
	console.log(JSON.stringify(listInfo));
	// end debug

	res.redirect('/list');
});

// error routes
app.use((req, res) => {
	res.status(404);
	res.render('404');
});

app.use((req, res) => {
	res.status(500);
	res.render('500');
});

// start server
app.listen(port, () => {
	console.log(`Express started on http://flipX.engr.oregonstate.edu:${port}; press Ctrl-C to terminate.`);
});
