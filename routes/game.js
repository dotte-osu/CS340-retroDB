module.exports = (function () {
    const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');

    //*****this query needs to be fixed once we update the database*****
    const getGame = "select * "
        + "from Games g "
        + "join GamesConsoles gc on g.gameID = gc.gameId "
        + "join Publishers p on g.publisherID = p.publisherID "
        + "join Consoles c on c.consoleID = gc.consoleID "
        + "where gameName = ?";


    router.get('/', function (req, res, next) {
        var name = req.query.name;
        mysql.pool.query(getGame, name, function (err, rows) {
            if (err) {
                next(err);
                return;
            }
            res.render('game', { rows, browse: true, style: 'results.css' });
        })
    });

    return router;
})();
