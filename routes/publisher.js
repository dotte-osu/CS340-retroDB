module.exports = (function () {
    const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');

    const getPublisher = "Select * from Publishers where publisherName = ?";

    router.get('/', function (req, res, next) {
        var name = req.query.name;
        mysql.pool.query(getPublisher, name, function (err, rows) {
            if (err) {
                next(err);
                return;
            }
            res.render('publisher', { rows, browse: true, style: 'results.css' });
        })
    });

    return router;
})();
