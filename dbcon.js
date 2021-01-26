var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,

  //TODO: fill out db info
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_dotte',
  password: '8814',
  database: 'cs340_dotte'
});

module.exports.pool = pool;