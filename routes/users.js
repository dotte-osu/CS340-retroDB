module.exports = (function() {
	const express = require('express');
	const userRouter = express.Router();
	const mysql = require('../dbcon.js');

	userRouter.get('/', function(req, res) {
        res.render('user', { user: true, style: 'user.css' });
    })

    userRouter.get('/login', function(req, res) {
        res.render('login', { login: true, style: 'login.css' });
    })

    userRouter.get('/register', function(req, res) {
    	res.render('register', { register: true, style: 'login.css' });
    })

    userRouter.get('/admin', function(req, res) {
    	res.render('admin', { admin: true, style: 'admin.css' });
    })

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
    })

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
    })

	return userRouter;
})();
