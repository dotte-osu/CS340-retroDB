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
	res.render('list', { style: 'list.css' });
});

app.get('/list/create', function(req, res, next) {

	// using JSON to simulate getting info from MySQL
	games = [
		{id: 1, name: 'Mario Kart 64', console: 'Nintendo 64'},	// other info is estraneous rn
		{id: 2, name: 'Super Smash Bros. Melee', console: 'Nintendo Gamecube'},
		{id: 3, name: 'Bubsy 3D', console: 'Sony PlayStation'}
	]
	context = {style: 'create.css', games: games}

	res.render('create', context);
});

app.post('/user/login', function(req, res, next) {
	const { username, password } = req.body;

	// debug
	let userInfo = {
		username: username,
		password: password
	}
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
	const { name, game } = req.body

	// debug
	let listInfo = {
		'Game Name': name,
		'Games': game
	}
	console.log(JSON.stringify(listInfo))
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
