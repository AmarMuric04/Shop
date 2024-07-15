const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "-murga - nodejs",
  password: "amar",
});

module.exports = pool.promise();
