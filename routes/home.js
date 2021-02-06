module.exports = (function() {
	const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');
    
    const getGame = "select * "
        + "from Games g "
        + "join Publishers p on g.publisherID = p.publisherID "
        + "join Consoles c on c.consoleID = g.consoleID "
        + "limit 5";

    router.get('/', function(req, res) {
        res.redirect('/home');
    })

    router.get('/home', function (req, res, next) {
        var name = req.query.name;
        mysql.pool.query(getGame, name, function (err, rows) {
            if (err) {
                next(err);
                return;
            }
            res.render('index', { rows, home: true, style: 'home.css' });
        })
    });

    return router;
})();
