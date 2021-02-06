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
const port = 54323; // can change to a different port

// routes
app.use('/list', require('./routes/lists.js'));
app.use('/results', require('./routes/results.js'));
app.use('/game', require('./routes/game.js'));
app.use('/publisher', require('./routes/publisher.js'));
app.use('/console', require('./routes/console.js'));

app.get('/', (req, res) => {
	res.redirect('/home');
});

app.get('/home', function(req, res, next) {
	res.render('index', { home: true, style: 'home.css' });
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
