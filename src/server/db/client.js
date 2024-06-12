// require("dotenv").config();
const { Client } = require("pg");
const connectionString =
  process.env.DATABASE_URL ||
  `${process.env.BASEURL}:${process.env.PORT}/${process.env.DBname}`;
const db = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = db;
