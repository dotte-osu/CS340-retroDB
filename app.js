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
const port = 54321;		// can change to a different port

// routes
app.get('/', (req, res) => {
	res.render('index');
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
