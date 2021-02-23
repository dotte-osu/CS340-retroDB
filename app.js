const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mysql = require('./dbcon.js');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'XTCkQE&t%yRV$2dyn8ZUkt3EKP98gpHB34HX8d&&yJVuPmjMe',
	resave: true,
	saveUninitialized:true
}));

app.engine(
	'handlebars',
	handlebars({
		defaultLayout: 'main',
		layoutsDir: __dirname + '/views/layouts/',
		partialsDir: __dirname + '/views/partials/'
	})
);

app.use(function(req, res, next) {
	res.locals.user = req.session.username;
	next();
});

app.set('view engine', 'handlebars');

const port = 54323; // can change to a different port

// routes
app.use('/', require('./routes/home.js'));
app.use('/results', require('./routes/results.js'));
app.use('/user', require('./routes/users.js'));
app.use('/list', require('./routes/lists.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/game', require('./routes/game.js'));
app.use('/publisher', require('./routes/publisher.js'));
app.use('/console', require('./routes/console.js'));

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
