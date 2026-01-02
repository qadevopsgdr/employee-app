const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "employees_db",
  user: process.env.DB_USER || "employee_user",
  password: process.env.DB_PASSWORD || "employee_pass",
});

module.exports = pool;

