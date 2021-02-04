module.exports = (function () {
    const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');

    const getConsole = "Select * from Consoles where consoleName = ?";

    router.get('/', function (req, res, next) {
        var name = req.query.name;
        mysql.pool.query(getConsole, name, function (err, rows) {
            if (err) {
                next(err);
                return;
            }
            res.render('console', { rows, browse: true, style: 'results.css' });
        })
    });

    return router;
})();
