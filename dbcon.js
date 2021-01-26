var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,

  //TODO: fill out db info
  host: '',
  user: '',
  password: '',
  database: ''
});

module.exports.pool = pool;