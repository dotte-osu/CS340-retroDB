module.exports = (function () {
    const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');


    //*****this query needs to be fixed once we update the database*****
    const getListQuery = "select gameName, gameReleaseYear, consoleName, consoleType, publisherName, consoleDeveloper "
        + "from Games g "
        + "join GamesConsoles gc on g.gameID = gc.gameID "
        + "join Consoles c on c.consoleID = gc.consoleID "
        + "join Publishers p on g.publisherID = p.publisherID ";

    function generateQuery(req, query) {
        //get user input
        var serchBy = "";
        var type = req.query.searchType;
        var keyword = req.query.keyword.trim();

        //built query
        if (type == "games") serchBy = "where gameName like '%key%'".replace("key", keyword);
        else if (type == "publishers") serchBy = "where publisherName like '%key%'".replace("key", keyword);
        else serchBy = "where consoleName like '%key%'".replace("key", keyword);

        //handle the case when user input is ""
        if (keyword != "") query = getListQuery.concat(serchBy);
        else query = getListQuery;
    }

    function GetList(req, res, mysql, context, complete) {
        var query = ""
        generateQuery(req, query);
        
        //dont error out when a user click Browse page directly
        if (req.query.searchType == undefined) {
            res.render('results', { browse: true, style: 'results.css' });
        }
        else {
            //get user input
            var serchBy = "";
            var type = req.query.searchType;
            var keyword = req.query.keyword.trim();

            //built query
            if (type == "games") serchBy = "where gameName like '%key%'".replace("key", keyword);
            else if (type == "publishers") serchBy = "where publisherName like '%key%'".replace("key", keyword);
            else serchBy = "where consoleName like '%key%'".replace("key", keyword);

            //handle the case when user input is ""
            if (keyword != "") query = getListQuery.concat(serchBy);
            else query = getListQuery;

            mysql.pool.query(query, function (err, rows) {
                if (err) {
                    console.log('Failed to fetch Data:', error);
                    res.end();
                }
                context.rows = rows;
            });
        }
    }

    router.get('/', function (req, res, next) {
        var callbackCount = 0;
        var context = {};
        GetList(req, res, mysql, context);

        //console.log(context)
        res.render('results', { context, browse: true, style: 'results.css' });
    });

    return router;
})();
