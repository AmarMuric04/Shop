// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "-murga - nodejs",
//   password: "amar",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("-murga - nodejs", "root", "amar", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
