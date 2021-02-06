module.exports = (function () {
    const express = require('express');
    const router = express.Router();
    const mysql = require('../dbcon.js');

    const getListQuery = "select gameName, gameReleaseYear, consoleName, consoleType, publisherName, consoleDeveloper "
        + "from Games g "
        + "join Consoles c on c.consoleID = g.consoleID "
        + "join Publishers p on g.publisherID = p.publisherID ";

    //get data for filters
    const getGamesQ = "select distinct gameReleaseYear from Games";
    const getConsolesQ = "select * from Consoles";
    const getPublishersQ = "select * from Publishers";

    function getGemes(req, res, mysql, context, complete) {
        mysql.pool.query(getGamesQ, function (err, rows) {
            if (err) {
                console.log('Failed to fetch Data:', error);
                res.end();
            }
            context.games = rows;
            complete();
        });
    }

    function getConsoles(req, res, mysql, context, complete) {
        mysql.pool.query(getConsolesQ, function (err, rows) {
            if (err) {
                console.log('Failed to fetch Data:', error);
                res.end();
            }
            context.consoles = rows;
            complete();
        });
    }

    function getPublishers(req, res, mysql, context, complete) {
        mysql.pool.query(getPublishersQ, function (err, rows) {
            if (err) {
                console.log('Failed to fetch Data:', error);
                res.end();
            }
            context.publishers = rows;
            complete();
        });
    }
    function generateQuery(type, keyword) {
        //get user input
        var query = "";
        var serchBy = "";        
        //built query
        if (type == "games") serchBy = "where gameName like '%key%'".replace("key", keyword);
        else if (type == "publishers") serchBy = "where publisherName like '%key%'".replace("key", keyword);
        else serchBy = "where consoleName like '%key%'".replace("key", keyword);

        //handle the case when user input is ""
        if (keyword != "") query = getListQuery.concat(serchBy);
        else query = getListQuery;

        query = query + " order by gameName"
        return query;
    }

    //generate query for post request
    function genPostQuery(postBody) {
        var query = getListQuery;
        var isFirst = true;
        var condition = "where ";
        var isLike = true;
        var name = "";
        var value = "";

        for (var i in postBody) {
            if (!isFirst) condition = " and ";

            if (postBody[i].name == "searchType" && postBody[i].value != undefined) {      
                name = postBody[i].value;
            } else if (postBody[i].name == "keyword" && postBody[i].value != "") {
                value = "%" + postBody[i].value  + "%";
            } else {
                name = postBody[i].name;
                value = postBody[i].value;
                isLike = false;
            }

            if (name != "" && value !="") {
                var line = "";
                if (isLike) line = condition + name + " like '" + value + "' ";
                else line = condition + name + " = '" + value + "' ";

                query = query.concat(line);
                isFirst = false;
                name = "";
                value = "";
            }
        }
        query = query + " order by gameName"
        return query;
    }

    function getList(req, res, mysql, context, complete, postBody) {
        
        var query = "";        
        //dont error out when a user click Browse page directly
        if (req.query.searchType != undefined) {
            var type = req.query.searchType;
            var keyword = req.query.keyword.trim();

            var query = "";
            //console.log(postBody);
            query = generateQuery(type, keyword);
            
            mysql.pool.query(query, function (err, rows) {
                if (err) {
                    console.log('Failed to fetch Data:', error);
                    res.end();
                }
                context.rows = rows;
            });
        }


        //for post request
        if (postBody != null) {
            query = genPostQuery(postBody);
            mysql.pool.query(query, function (err, rows) {
                if (err) {
                    console.log('Failed to fetch Data:', error);
                    res.end();
                }
                context.rows = rows;
            });
        }
        complete();
    }

    function sortFilters(context) {
        var consoleName = [];
        var consoleDeveloper = [];
        var consoleType = [];
        var publisherName = [];
        var yearFounded = [];
        var hqCountry = [];
        var gameReleaseYear = [];

        //console.log(context)
        for (var i in context.consoles) {
            if (context.consoles[i].consoleName != undefined && !consoleName.includes(context.consoles[i].consoleName)) consoleName.push(context.consoles[i].consoleName);
            if (context.consoles[i].consoleDeveloper != undefined && !consoleDeveloper.includes(context.consoles[i].consoleDeveloper)) consoleDeveloper.push(context.consoles[i].consoleDeveloper);
            if (context.consoles[i].consoleType != undefined && !consoleType.includes(context.consoles[i].consoleType)) consoleType.push(context.consoles[i].consoleType);

        }
        for (var i in context.publishers) {
            if (context.publishers[i].publisherName != undefined && !publisherName.includes(context.publishers[i].publisherName)) publisherName.push(context.publishers[i].publisherName);
            if (context.publishers[i].yearFounded != undefined && !yearFounded.includes(context.publishers[i].yearFounded)) yearFounded.push(context.publishers[i].yearFounded);
            if (context.publishers[i].hqCountry != undefined && !hqCountry.includes(context.publishers[i].hqCountry)) hqCountry.push(context.publishers[i].hqCountry);
            if (context.publishers[i].gameReleaseYear != undefined && !gameReleaseYear.includes(context.publishers[i].gameReleaseYear)) gameReleaseYear.push(context.publishers[i].gameReleaseYear);
        }
        for (var i in context.games) {
            if (context.games[i].gameReleaseYear != undefined && !gameReleaseYear.includes(context.games[i].gameReleaseYear)) gameReleaseYear.push(context.games[i].gameReleaseYear);
        }

        consoleName.sort();
        consoleDeveloper.sort();
        consoleType.sort();
        publisherName.sort();
        yearFounded.sort();
        hqCountry.sort();
        gameReleaseYear.sort();

        context.consoleName = consoleName;
        context.consoleDeveloper = consoleDeveloper;
        context.consoleType = consoleType;
        context.publisherName = publisherName;
        context.yearFounded = yearFounded;
        context.hqCountry = hqCountry;
        context.gameReleaseYear = gameReleaseYear;
    }

    router.get('/', function (req, res, next) {
        var callbackCount = 0;
        var context = {};
        
        getGemes(req, res, mysql, context, complete);
        getConsoles(req, res, mysql, context, complete);
        getPublishers(req, res, mysql, context, complete);
        getList(req, res, mysql, context, complete, null);
        function complete() {
            callbackCount++;
            if (callbackCount >= 4) {
                sortFilters(context)
                res.render('results', { context, browse: true, style: 'results.css' });
            }
        }
    });

    //search from browse page is post request
    router.post('/', function (req, res) {
        var context = {};
        var postBody = [];
        var noKeyWord = true;
        for (var p in req.body) {
            postBody.push({ 'name': p, 'value': req.body[p] });
            if (p != "searchType" &&  req.body[p] != "") noKeyWord = false;
        }

        if (noKeyWord) {
            var callbackCount = 0;
            getGemes(req, res, mysql, context, complete);
            getConsoles(req, res, mysql, context, complete);
            getPublishers(req, res, mysql, context, complete);
            function complete() {
                callbackCount++;
                if (callbackCount >= 3) {
                    sortFilters(context)
                    var m = "Please fill out the search bar or select at least one filter"
                    res.render('results', { context, browse: true, style: 'results.css', messages: m });
                }
            }           
        } else {
            var callbackCount = 0;
            getGemes(req, res, mysql, context, complete);
            getConsoles(req, res, mysql, context, complete);
            getPublishers(req, res, mysql, context, complete);
            getList(req, res, mysql, context, complete, postBody);
            function complete() {
                callbackCount++;
                if (callbackCount >= 4) {
                    sortFilters(context)
                    res.render('results', { context, browse: true, style: 'results.css', messages: ""});
                }
            }           
        }
    });
    return router;
})();
